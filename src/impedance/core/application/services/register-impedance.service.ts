import { inject, injectable } from 'inversify';

import { Impedance } from '../../domain/impedance';
import { RegisterImpedanceInput, RegisterImpedanceInputPort } from '../ports/in/register-impedance.input-port';
import {
  ImpedanceRepositoryOutputPort,
  IMPEDANCE_REPOSITORY_OUTPUT_PORT,
} from '../ports/out/impedance-repository.output-port';
import {
  CabinetRepositoryOutputPort,
  CABINET_REPOSITORY_OUTPUT_PORT,
} from '../../../../cabinet/core/application/ports/out/cabinet-repository.output-port';
import { CabinetDoesNotExist } from '../../../../cabinet/core/domain/errors';
import { ImpedanceAlreadyExists } from '../../../../impedance/core/domain/errors';

// verify if cabinet-uid in the RegisterImpedanceInput exists in the database
// split the payload between 2 categories of data
// map TSP and impedance curve separetely
// group them and create an impedance object
// store impedance object in database

const ThieleSmallParametersPattern = {
  source: /DATS/,
  pistonDiameter: /(?<=Piston Diameter = ).* /,
  resonanceFrequency: /(?<=(f[(]s[)]=)).* /,
  dcResistance: /(?<=(R[(]e[)]=)).* /,
  acResistance: /(?<=(Z[(]max[)]=)).* /,
  mechanicalDamping: /(?<=(Q[(]ms[)]=)).*/,
  electricalDamping: /(?<=(Q[(]es[)]=)).*/,
  totalDamping: /(?<=(Q[(]es[)]=)).*/,
  equivalenceCompliance: /(?<=(V[(]as[)]=)).*(liters)/,
  voiceCoilInductance: /(?<=(L[(]e[)]=)).* /,
  efficiency: /(?<=(n[(]0[)]=)).*/,
  sensitivity: /(?<=(SPL=)).*/,
  coneMass: /(?<=(M[(]ms[)]=)).*/,
  suspensionCompliance: /(?<=(C[(]ms[)]=)).*/,
  forceFactor: /(?<=(BL=)).*/,
  kR: /(?<=(K[(]r[)]=)).*/,
  xR: /(?<=(X[(]r[)]=)).*/,
  kI: /(?<=(K[(]i[)]=)).*/,
  xI: /(?<=(X[(]i[)]=)).*/,
};

enum ThieleSmallParametersName {
  Source = 'source',
  pistonDiameter = 'pistonDiameter',
  resonanceFrequency = 'resonanceFrequency',
  dcResistance = 'dcResistance',
  acResistance = 'acResistance',
  mechanicalDamping = 'mechanicalDamping',
  electricalDamping = 'electricalDamping',
  totalDamping = 'totalDamping',
  equivalenceCompliance = 'equivalenceCompliance',
  voiceCoilInductance = 'voiceCoilInductance',
  efficiency = 'efficiency',
  sensitivity = 'sensitivity',
  coneMass = 'coneMass',
  suspensionCompliance = 'suspensionCompliance',
  forceFactor = 'forceFactor',
  kR = 'kR',
  xR = 'xR',
  kI = 'kI',
  xI = 'xI',
}

interface ParameterAndPattern {
  name: ThieleSmallParametersName;
  pattern: RegExp;
}

const PARAMETERS_AND_PATTERNS: ParameterAndPattern[] = [
  { name: ThieleSmallParametersName.Source, pattern: ThieleSmallParametersPattern.source },
  { name: ThieleSmallParametersName.pistonDiameter, pattern: ThieleSmallParametersPattern.pistonDiameter },
  { name: ThieleSmallParametersName.resonanceFrequency, pattern: ThieleSmallParametersPattern.resonanceFrequency },
  { name: ThieleSmallParametersName.dcResistance, pattern: ThieleSmallParametersPattern.dcResistance },
  { name: ThieleSmallParametersName.acResistance, pattern: ThieleSmallParametersPattern.acResistance },
  { name: ThieleSmallParametersName.mechanicalDamping, pattern: ThieleSmallParametersPattern.mechanicalDamping },
  { name: ThieleSmallParametersName.electricalDamping, pattern: ThieleSmallParametersPattern.electricalDamping },
  { name: ThieleSmallParametersName.totalDamping, pattern: ThieleSmallParametersPattern.totalDamping },
  {
    name: ThieleSmallParametersName.equivalenceCompliance,
    pattern: ThieleSmallParametersPattern.equivalenceCompliance,
  },
  { name: ThieleSmallParametersName.voiceCoilInductance, pattern: ThieleSmallParametersPattern.voiceCoilInductance },
  { name: ThieleSmallParametersName.efficiency, pattern: ThieleSmallParametersPattern.efficiency },
  { name: ThieleSmallParametersName.sensitivity, pattern: ThieleSmallParametersPattern.sensitivity },
  { name: ThieleSmallParametersName.coneMass, pattern: ThieleSmallParametersPattern.coneMass },
  { name: ThieleSmallParametersName.suspensionCompliance, pattern: ThieleSmallParametersPattern.suspensionCompliance },
  { name: ThieleSmallParametersName.forceFactor, pattern: ThieleSmallParametersPattern.forceFactor },
  { name: ThieleSmallParametersName.kR, pattern: ThieleSmallParametersPattern.kR },
  { name: ThieleSmallParametersName.xR, pattern: ThieleSmallParametersPattern.xR },
  { name: ThieleSmallParametersName.kI, pattern: ThieleSmallParametersPattern.kI },
  { name: ThieleSmallParametersName.xI, pattern: ThieleSmallParametersPattern.xI },
];

@injectable()
export class RegisterImpedanceService implements RegisterImpedanceInputPort {
  constructor(
    @inject(IMPEDANCE_REPOSITORY_OUTPUT_PORT) private readonly impedanceRepository: ImpedanceRepositoryOutputPort,
    @inject(CABINET_REPOSITORY_OUTPUT_PORT) private readonly cabinetRepository: CabinetRepositoryOutputPort,
  ) {}

  async handler(input: RegisterImpedanceInput): Promise<Impedance> {
    const existingCabinet = await this.cabinetRepository.getById(input.cabinetUid);
    if (!existingCabinet) throw new CabinetDoesNotExist(input.cabinetUid);
    const existingImpedance = await this.impedanceRepository.getByCabinetUid(input.cabinetUid);
    if (existingImpedance) throw new ImpedanceAlreadyExists(input.cabinetUid);

    this.mapImpedance(input.measurements);

    return this.createFakePayload();
  }

  mapImpedance(measurements: string) {
    //ImpedanceProps
    const tSPAndImpedanceCurve = measurements.split(/[*]\r\n[*]\r\nFreq.*\r\n/);

    this.mapThieleSmallParameters(tSPAndImpedanceCurve[0]);
    return tSPAndImpedanceCurve;
  }

  mapThieleSmallParameters(parameters: string) {
    const parametersList = parameters.split('\n');
    for (const parameterAndPattern of PARAMETERS_AND_PATTERNS) {
      this.mapSingleParameter(parametersList, parameterAndPattern);
    }
  }

  mapSingleParameter(parametersList: string[], parameterAndPattern: ParameterAndPattern) {
    for (const parameter of parametersList) {
      const matchingParameter = this.matchParameter(parameter, parameterAndPattern.pattern);
      if (matchingParameter) console.log(matchingParameter);
    }
  }

  matchParameter(parameter: string, pattern: RegExp): string | undefined {
    const match = parameter.match(pattern);
    if (match?.length) return match[0];
    return undefined;
  }

  createFakePayload(): Impedance {
    return new Impedance({
      pistonDiameter: 1,
      resonanceFrequency: 1,
      dcResistance: 1,
      acResistance: 1,
      mechanicalDamping: 1,
      electricalDamping: 1,
      totalDamping: 1,
      equivalenceCompliance: 1,
      voiceCoilInductance: 1,
      efficiency: 1,
      sensitivity: 1,
      coneMass: 1,
      suspensionCompliance: 1,
      forceFactor: 1,
      kR: 1,
      xR: 1,
      kI: 1,
      xI: 1,
      cabinetUid: '',
      impedanceCurve: [
        {
          frequency: 1,
          impedance: 1,
          phase: 1,
        },
      ],
    });
  }
}
//(?<=(V[(]as[)]= )).*
