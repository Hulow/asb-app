import { ImpedanceParameterNotFound } from '../../../domain/impedance/errors'
import {
  ImpedanceMeasurement,
  ImpedanceProps,
  ThieleSmallParameters,
} from '../../../domain/impedance/impedance'
import { RegisterImpedanceCommand } from './register-impedance.command'

interface ImpedanceCurve {
  frequencies: number[]
  highestFrequency: number
  lowestFrequency: number
  impedances: number[]
  highestImpedance: number
  lowestImpedance: number
  phases: number[]
  highestPhase: number
  lowestPhase: number
}

export class RegisterImpedanceMapper {
  mapImpedance(command: RegisterImpedanceCommand): ImpedanceProps {
    const [parameters, data] = command.measurements.split(/Freq.*/)
    const tsp = this.mapTSP(parameters)
    const impedanceResponse = this.mapImpedanceCurve(data)
    return this.mapImpedanceObject(command, tsp, impedanceResponse)
  }

  private mapTSP(data: string): ThieleSmallParameters {
    const parameters = data.split('\n')
    const matchingParametersInMemory: [TSPName, string][] = []
    for (const parameterAndPattern of PARAMETERS_AND_PATTERNS) {
      const matchingParameter = this.mapSingleParameter(
        parameters,
        parameterAndPattern,
      )
      matchingParametersInMemory.push(matchingParameter)
    }
    return Object.fromEntries(
      new Map(matchingParametersInMemory),
    ) as ThieleSmallParameters
  }

  private mapSingleParameter(
    parametersList: string[],
    parameterAndPattern: ParameterAndPattern,
  ): [TSPName, string] {
    for (const parameter of parametersList) {
      const matchingParameter = this.matchParameter(
        parameter,
        parameterAndPattern.pattern,
      )
      if (matchingParameter) {
        return [parameterAndPattern.name, matchingParameter]
      }
    }
    throw new ImpedanceParameterNotFound(parameterAndPattern.name)
  }

  private matchParameter(
    parameter: string,
    pattern: RegExp,
  ): string | undefined {
    const match = parameter.match(pattern)
    return match?.length ? match[0].trim() : undefined
  }

  private mapImpedanceCurve(measurements: string): ImpedanceCurve {
    const splitMeasurements: string[] = measurements.split(/\n/)
    const frequencies: number[] = []
    const impedances: number[] = []
    const phases: number[] = []
    for (const measurement of splitMeasurements) {
      const frequencyPhaseAndImpedance: ImpedanceMeasurement | undefined =
        this.mapFrequencyPhaseAndImpedance(measurement)
      if (frequencyPhaseAndImpedance) {
        frequencies.push(frequencyPhaseAndImpedance.frequency)
        impedances.push(frequencyPhaseAndImpedance.impedance)
        phases.push(frequencyPhaseAndImpedance.phase)
      }
    }
    const lowestFrequency = frequencies[0]
    const highestFrequency = this.getLastInput(frequencies)
    const lowestImpedance = impedances[0]
    const highestImpedance = this.getLastInput(impedances)
    const highestPhase = phases[0]
    const lowestPhase = this.getLastInput(phases)

    return {
      frequencies,
      lowestFrequency,
      highestFrequency,
      impedances,
      lowestImpedance,
      highestImpedance,
      phases,
      highestPhase,
      lowestPhase,
    }
  }

  private getLastInput(inputs: number[]): number {
    return inputs[inputs.length - 1]
  }

  private mapFrequencyPhaseAndImpedance(
    measurement: string,
  ): ImpedanceMeasurement | undefined {
    const extractedFrequencyPhaseAndImpedance = measurement.trim().split(/\s+/)
    if (!this.isValidMeasurement(extractedFrequencyPhaseAndImpedance)) return
    return {
      frequency: Number(extractedFrequencyPhaseAndImpedance[0]),
      impedance: Number(extractedFrequencyPhaseAndImpedance[1]),
      phase: Number(extractedFrequencyPhaseAndImpedance[2]),
    }
  }

  private isValidMeasurement(measurement: string[]): boolean {
    return this.doPhaseImpedanceAndFrequencyExist(measurement) &&
      this.areValidValues(measurement)
      ? true
      : false
  }

  private doPhaseImpedanceAndFrequencyExist(measurement: string[]): boolean {
    return measurement.length === 3 ? true : false
  }

  private areValidValues(measurement: string[]): boolean {
    for (const value of measurement) {
      if (value.length === 0) return false
    }
    return true
  }

  private mapImpedanceObject(
    command: RegisterImpedanceCommand,
    thieleSmallParameters: ThieleSmallParameters,
    impedanceCurve: ImpedanceCurve,
  ): ImpedanceProps {
    return {
      ...thieleSmallParameters,
      ...{ cabinetUid: command.cabinetUid },
      ...{ driverUid: command.driverUid },
      ...{
        frequencies: impedanceCurve.frequencies,
        highestFrequency: impedanceCurve.highestFrequency,
        lowestFrequency: impedanceCurve.lowestFrequency,
        impedances: impedanceCurve.impedances,
        highestImpedance: impedanceCurve.highestImpedance,
        lowestImpedance: impedanceCurve.lowestImpedance,
        phases: impedanceCurve.phases,
        lowestPhase: impedanceCurve.lowestPhase,
        highestPhase: impedanceCurve.highestPhase,
      },
    }
  }
}

const TSPPatterns = {
  source: /DATS/,
  pistonDiameter: /(?<=Piston Diameter = ).* /,
  resonanceFrequency: /(?<=(f[(]s[)]=)).* /,
  dcResistance: /(?<=(R[(]e[)]=)).* /,
  acResistance: /(?<=(Z[(]max[)]=)).* /,
  mechanicalDamping: /(?<=(Q[(]ms[)]=)).*/,
  electricalDamping: /(?<=(Q[(]es[)]=)).*/,
  totalDamping: /(?<=(Q[(]ts[)]=)).*/,
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
}

enum TSPName {
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
  name: TSPName
  pattern: RegExp
}

const PARAMETERS_AND_PATTERNS: ParameterAndPattern[] = [
  { name: TSPName.Source, pattern: TSPPatterns.source },
  { name: TSPName.PistonDiameter, pattern: TSPPatterns.pistonDiameter },
  { name: TSPName.ResonanceFrequency, pattern: TSPPatterns.resonanceFrequency },
  { name: TSPName.DcResistance, pattern: TSPPatterns.dcResistance },
  { name: TSPName.AcResistance, pattern: TSPPatterns.acResistance },
  { name: TSPName.MechanicalDamping, pattern: TSPPatterns.mechanicalDamping },
  { name: TSPName.ElectricalDamping, pattern: TSPPatterns.electricalDamping },
  { name: TSPName.TotalDamping, pattern: TSPPatterns.totalDamping },
  {
    name: TSPName.EquivalenceCompliance,
    pattern: TSPPatterns.equivalenceCompliance,
  },
  {
    name: TSPName.VoiceCoilInductance,
    pattern: TSPPatterns.voiceCoilInductance,
  },
  { name: TSPName.Efficiency, pattern: TSPPatterns.efficiency },
  { name: TSPName.Sensitivity, pattern: TSPPatterns.sensitivity },
  { name: TSPName.ConeMass, pattern: TSPPatterns.coneMass },
  {
    name: TSPName.SuspensionCompliance,
    pattern: TSPPatterns.suspensionCompliance,
  },
  { name: TSPName.ForceFactor, pattern: TSPPatterns.forceFactor },
  { name: TSPName.Kr, pattern: TSPPatterns.kR },
  { name: TSPName.Xr, pattern: TSPPatterns.xR },
  { name: TSPName.Ki, pattern: TSPPatterns.kI },
  { name: TSPName.Xi, pattern: TSPPatterns.xI },
]
