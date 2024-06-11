import { DomainEntity, EntityProps } from '../../../../shared/domain/entity'

export interface FrequencyProps {
  measuredBy: string
  source: string
  sweepLength: string
  measuredAt: string
  frequencyWeightings: string
  targetLevel: string
  note: string
  smoothing: string
  frequencies: number[]
  highestFrequency: number
  lowestFrequency: number
  spls: number[]
  highestSpl: number
  lowestSpl: number
  phases: number[]
  cabinetUid: string
}

export class Frequency extends DomainEntity {
  readonly measuredBy: string
  readonly source: string
  readonly sweepLength: string
  readonly measuredAt: string
  readonly frequencyWeightings: string
  readonly targetLevel: string
  readonly note: string
  readonly smoothing: string
  readonly frequencies: number[]
  readonly highestFrequency: number
  readonly lowestFrequency: number
  readonly spls: number[]
  readonly highestSpl: number
  readonly lowestSpl: number
  readonly phases: number[]
  readonly cabinetUid: string

  constructor(props: FrequencyProps & EntityProps) {
    super(props)

    this.measuredBy = props.measuredBy
    this.source = props.source
    this.sweepLength = props.sweepLength
    this.measuredAt = props.measuredAt
    this.frequencyWeightings = props.frequencyWeightings
    this.targetLevel = props.targetLevel
    this.note = props.note
    this.smoothing = props.smoothing
    this.frequencies = props.frequencies
    this.highestFrequency = props.highestFrequency
    this.lowestFrequency = props.lowestFrequency
    this.spls = props.spls
    this.highestSpl = props.highestSpl
    this.lowestSpl = props.lowestSpl
    this.phases = props.phases
    this.cabinetUid = props.cabinetUid
  }
}
