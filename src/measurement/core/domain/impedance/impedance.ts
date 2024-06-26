import { DomainEntity, EntityProps } from '../../../../shared/domain/entity'

export interface ImpedanceProps {
  source: string
  pistonDiameter: string
  resonanceFrequency: string
  dcResistance: string
  acResistance: string
  mechanicalDamping: string
  electricalDamping: string
  totalDamping: string
  equivalenceCompliance: string
  voiceCoilInductance: string
  efficiency: string
  sensitivity: string
  coneMass: string
  suspensionCompliance: string
  forceFactor: string
  kR: string
  xR: string
  kI: string
  xI: string
  cabinetUid: string
  driverUid: string
  frequencies: number[]
  lowestFrequency: number
  highestFrequency: number
  impedances: number[]
  lowestImpedance: number
  highestImpedance: number
  phases: number[]
  lowestPhase: number
  highestPhase: number
}

export interface ImpedanceMeasurement {
  frequency: number
  impedance: number
  phase: number
}

export type ThieleSmallParameters = Omit<
  ImpedanceProps,
  | 'frequencies'
  | 'cabinetUid'
  | 'impedances'
  | 'phases'
  | 'highestFrequency'
  | 'lowestFrequency'
  | 'highestImpedance'
  | 'lowestImpedance'
  | 'lowestPhase'
  | 'highestPhase'
>

export class Impedance extends DomainEntity {
  readonly source: string
  readonly pistonDiameter: string
  readonly resonanceFrequency: string
  readonly dcResistance: string
  readonly acResistance: string
  readonly mechanicalDamping: string
  readonly electricalDamping: string
  readonly totalDamping: string
  readonly equivalenceCompliance: string
  readonly voiceCoilInductance: string
  readonly efficiency: string
  readonly sensitivity: string
  readonly coneMass: string
  readonly suspensionCompliance: string
  readonly forceFactor: string
  readonly kR: string
  readonly xR: string
  readonly kI: string
  readonly xI: string
  readonly cabinetUid: string
  readonly driverUid: string
  readonly frequencies: number[]
  readonly lowestFrequency: number
  readonly highestFrequency: number
  readonly impedances: number[]
  readonly lowestImpedance: number
  readonly highestImpedance: number
  readonly phases: number[]
  readonly highestPhase: number
  readonly lowestPhase: number

  constructor(props: ImpedanceProps & EntityProps) {
    super(props)
    this.source = props.source
    this.pistonDiameter = props.pistonDiameter
    this.resonanceFrequency = props.resonanceFrequency
    this.dcResistance = props.dcResistance
    this.acResistance = props.acResistance
    this.mechanicalDamping = props.mechanicalDamping
    this.electricalDamping = props.electricalDamping
    this.totalDamping = props.totalDamping
    this.equivalenceCompliance = props.equivalenceCompliance
    this.voiceCoilInductance = props.voiceCoilInductance
    this.efficiency = props.efficiency
    this.sensitivity = props.sensitivity
    this.coneMass = props.coneMass
    this.suspensionCompliance = props.suspensionCompliance
    this.forceFactor = props.forceFactor
    this.kR = props.kR
    this.xR = props.xR
    this.kI = props.kI
    this.xI = props.xI
    this.cabinetUid = props.cabinetUid
    this.driverUid = props.driverUid
    this.frequencies = props.frequencies
    this.lowestFrequency = props.lowestFrequency
    this.highestFrequency = props.highestFrequency
    this.impedances = props.impedances
    this.highestImpedance = props.highestImpedance
    this.lowestImpedance = props.lowestImpedance
    this.phases = props.phases
    this.highestPhase = props.highestPhase
    this.lowestPhase = props.lowestPhase
  }
}
