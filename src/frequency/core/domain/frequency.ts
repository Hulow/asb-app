import { DomainEntity, EntityProps } from '../../../shared/domain/entity';

export interface FrequencyProps {
  measuredBy: string;
  source: string;
  sweepLength: string;
  measuredAt: string;
  frequencyWeightings: string;
  targetLevel: string;
  note: string;
  smoothing: string;
  frequencies: number[];
  spls: number[];
  phases: number[];
  cabinetUid: string;
}

export class Frequency extends DomainEntity {
  readonly measuredBy: string;
  readonly source: string;
  readonly sweepLength: string;
  readonly measuredAt: string;
  readonly frequencyWeightings: string;
  readonly targetLevel: string;
  readonly note: string;
  readonly smoothing: string;
  readonly frequencies: number[];
  readonly spls: number[];
  readonly phases: number[];
  readonly cabinetUid: string;

  constructor(props: FrequencyProps & EntityProps) {
    super(props);

    this.measuredBy = props.measuredBy;
    this.source = props.source;
    this.sweepLength = props.sweepLength;
    this.measuredAt = props.measuredAt;
    this.frequencyWeightings = props.frequencyWeightings;
    this.targetLevel = props.targetLevel;
    this.note = props.note;
    this.smoothing = props.smoothing;
    this.frequencies = props.frequencies;
    this.spls = props.spls;
    this.phases = props.phases;
    this.cabinetUid = props.cabinetUid;
  }
}
