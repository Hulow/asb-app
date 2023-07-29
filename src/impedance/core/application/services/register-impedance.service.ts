import { inject, injectable } from 'inversify';

import { Impedance, ImpedanceMeasurement, ImpedanceProps, ThieleSmallParameters } from '../../domain/impedance';
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
import { ImpedanceAlreadyExists, ImpedanceParameterNotFound } from '../../../../impedance/core/domain/errors';

const ThieleSmallParametersPattern = {
  source: /DATS/,
  pistonDiameter: /(?<=Piston Diameter = ).* /,
  resonanceFrequency: /(?<=(f[(]s[)]=)).* /,
  dcResistance: /(?<=(R[(]e[)]=)).* /,
  acResistance: /(?<=(Z[(]max[)]=)).* /,
  mechanicalDamping: /(?<=(Q[(]ms[)]=)).*/,
  electricalDamping: /(?<=(Q[(]es[)]=)).*/,
  totalDamping: /(?<=(Q[(]es[)]=)).*/,
  equivalenceCompliance: /(?<=(V[(]as[)]= ))\S*/,
  voiceCoilInductance: /(?<=(L[(]e[)]= ))\S*/,
  efficiency: /(?<=(n[(]0[)]= ))\S*/,
  sensitivity: /(?<=(SPL=)) \S*/,
  coneMass: /(?<=(M[(]ms[)]=)) \S*/,
  suspensionCompliance: /(?<=(C[(]ms[)]=)) \S*/,
  forceFactor: /(?<=(BL=)).*/,
  kR: /(?<=(K[(]r[)]=)).*/,
  xR: /(?<=(X[(]r[)]=)).*/,
  kI: /(?<=(K[(]i[)]=)).*/,
  xI: /(?<=(X[(]i[)]=)).*/,
};

enum ThieleSmallParametersName {
  Source = 'source',
  PistonDiameter = 'pistonDiameter',
  ResonanceFrequency = 'resonanceFrequency',
  DcResistance = 'dcResistance',
  AcResistance = 'acResistance',
  MechanicalDamping = 'mechanicalDamping',
  ElectricalDamping = 'electricalDamping',
  TotalDamping = 'totalDamping',
  EquivalenceCompliance = 'equivalenceCompliance',
  VoiceCoilInductance = 'voiceCoilInductance',
  Efficiency = 'efficiency',
  Sensitivity = 'sensitivity',
  ConeMass = 'coneMass',
  SuspensionCompliance = 'suspensionCompliance',
  ForceFactor = 'forceFactor',
  Kr = 'kR',
  Xr = 'xR',
  Ki = 'kI',
  Xi = 'xI',
}

interface ParameterAndPattern {
  name: ThieleSmallParametersName;
  pattern: RegExp;
}

const PARAMETERS_AND_PATTERNS: ParameterAndPattern[] = [
  { name: ThieleSmallParametersName.Source, pattern: ThieleSmallParametersPattern.source },
  { name: ThieleSmallParametersName.PistonDiameter, pattern: ThieleSmallParametersPattern.pistonDiameter },
  { name: ThieleSmallParametersName.ResonanceFrequency, pattern: ThieleSmallParametersPattern.resonanceFrequency },
  { name: ThieleSmallParametersName.DcResistance, pattern: ThieleSmallParametersPattern.dcResistance },
  { name: ThieleSmallParametersName.AcResistance, pattern: ThieleSmallParametersPattern.acResistance },
  { name: ThieleSmallParametersName.MechanicalDamping, pattern: ThieleSmallParametersPattern.mechanicalDamping },
  { name: ThieleSmallParametersName.ElectricalDamping, pattern: ThieleSmallParametersPattern.electricalDamping },
  { name: ThieleSmallParametersName.TotalDamping, pattern: ThieleSmallParametersPattern.totalDamping },
  {
    name: ThieleSmallParametersName.EquivalenceCompliance,
    pattern: ThieleSmallParametersPattern.equivalenceCompliance,
  },
  { name: ThieleSmallParametersName.VoiceCoilInductance, pattern: ThieleSmallParametersPattern.voiceCoilInductance },
  { name: ThieleSmallParametersName.Efficiency, pattern: ThieleSmallParametersPattern.efficiency },
  { name: ThieleSmallParametersName.Sensitivity, pattern: ThieleSmallParametersPattern.sensitivity },
  { name: ThieleSmallParametersName.ConeMass, pattern: ThieleSmallParametersPattern.coneMass },
  { name: ThieleSmallParametersName.SuspensionCompliance, pattern: ThieleSmallParametersPattern.suspensionCompliance },
  { name: ThieleSmallParametersName.ForceFactor, pattern: ThieleSmallParametersPattern.forceFactor },
  { name: ThieleSmallParametersName.Kr, pattern: ThieleSmallParametersPattern.kR },
  { name: ThieleSmallParametersName.Xr, pattern: ThieleSmallParametersPattern.xR },
  { name: ThieleSmallParametersName.Ki, pattern: ThieleSmallParametersPattern.kI },
  { name: ThieleSmallParametersName.Xi, pattern: ThieleSmallParametersPattern.xI },
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

    const newImpedance = this.mapImpedance(input)

    return await this.impedanceRepository.save(new Impedance(newImpedance));
  }

  mapImpedance(input: RegisterImpedanceInput): ImpedanceProps {
    const tSPAndImpedanceCurve = input.measurements.split(/[*]\r\n[*]\r\nFreq.*\r\n/);
    const thieleSmallParameters = this.mapThieleSmallParameters(tSPAndImpedanceCurve[0]);
    const impedanceCurve = this.mapImpedanceCurve(tSPAndImpedanceCurve[1]);
    return { ...thieleSmallParameters, ...{ cabinetUid: input.cabinetUid }, ...{ impedanceCurve } };
  }

  mapThieleSmallParameters(parameters: string): ThieleSmallParameters {
    const parametersList = parameters.split('\n');
    const matchingParametersInMemory: [ThieleSmallParametersName, string][] = [];
    for (const parameterAndPattern of PARAMETERS_AND_PATTERNS) {
      const matchingParameter = this.mapSingleParameter(parametersList, parameterAndPattern);
      matchingParametersInMemory.push(matchingParameter);
    }
    return Object.fromEntries(new Map(matchingParametersInMemory)) as ThieleSmallParameters;
  }

  mapSingleParameter(
    parametersList: string[],
    parameterAndPattern: ParameterAndPattern,
  ): [ThieleSmallParametersName, string] {
    for (const parameter of parametersList) {
      const matchingParameter = this.matchParameter(parameter, parameterAndPattern.pattern);
      if (matchingParameter) {
        return [parameterAndPattern.name, matchingParameter];
      }
    }
    throw new ImpedanceParameterNotFound(parameterAndPattern.name);
  }

  matchParameter(parameter: string, pattern: RegExp): string | undefined {
    const match = parameter.match(pattern);
    if (match?.length) return match[0].trim();
    return undefined;
  }

  mapImpedanceCurve(measurements: string): ImpedanceMeasurement[] {
    const splitMeasurements: string[] = measurements.split(/\n/);
    const impedanceCurveInMemory: ImpedanceMeasurement[] = [];
    for (const measurement of splitMeasurements) {
      const frequencyPhaseAndImpedance: ImpedanceMeasurement | undefined =
        this.mapFrequencyPhaseAndImpedance(measurement);
      if (frequencyPhaseAndImpedance) impedanceCurveInMemory.push(frequencyPhaseAndImpedance);
    }
    return impedanceCurveInMemory;
  }

  mapFrequencyPhaseAndImpedance(measurement: string): ImpedanceMeasurement | undefined {
    const extractedFrequencyPhaseAndImpedance = measurement.trim().split(/\s+/);
    if (!this.isValidMeasurement(extractedFrequencyPhaseAndImpedance)) return;
    return {
      frequency: Number(extractedFrequencyPhaseAndImpedance[0]),
      impedance: Number(extractedFrequencyPhaseAndImpedance[1]),
      phase: Number(extractedFrequencyPhaseAndImpedance[2]),
    };
  }

  isValidMeasurement(measurement: string[]): boolean {
    return this.doPhaseImpedanceAndFrequencyExist(measurement) && this.areValidValues(measurement) ? true : false;
  }

  doPhaseImpedanceAndFrequencyExist(measurement: string[]): boolean {
    return measurement.length === 3 ? true : false;
  }

  areValidValues(measurement: string[]): boolean {
    for (const value of measurement) {
      if (value.length === 0) return false;
    }
    return true;
  }
}
