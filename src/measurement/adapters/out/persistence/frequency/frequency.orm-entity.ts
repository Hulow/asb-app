import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm'
import { Frequency } from '../../../../core/domain/frequency/frequency'

@Entity({ name: 'frequency' })
export class FrequencyTypeormEntity {
  @PrimaryColumn({ name: 'frequency_uid', type: 'uuid', update: false })
  uid!: string

  @Column({ name: 'measured_by', type: 'varchar' })
  measuredBy!: string

  @Column({ name: 'source', type: 'varchar' })
  source!: string

  @Column({ name: 'sweep_length', type: 'varchar' })
  sweepLength!: string

  @Column({ name: 'measured_at', type: 'varchar' })
  measuredAt!: string

  @Column({ name: 'frequency_weightings', type: 'varchar' })
  frequencyWeightings!: string

  @Column({ name: 'target_level', type: 'varchar' })
  targetLevel!: string

  @Column({ name: 'note', type: 'varchar' })
  note!: string

  @Column({ name: 'smoothing', type: 'varchar' })
  smoothing!: string

  @Column({ name: 'frequencies', type: 'jsonb' })
  frequencies!: number[]

  @Column({ name: 'highest_frequency', type: 'float' })
  highestFrequency!: number

  @Column({ name: 'lowest_frequency', type: 'float' })
  lowestFrequency!: number

  @Column({ name: 'spls', type: 'jsonb' })
  spls!: number[]

  @Column({ name: 'highest_spl', type: 'float' })
  highestSpl!: number

  @Column({ name: 'lowest_spl', type: 'float' })
  lowestSpl!: number

  @Column({ name: 'phases', type: 'jsonb' })
  phases!: number[]

  @Column({ name: 'cabinet_uid', type: 'uuid' })
  cabinetUid!: string

  @CreateDateColumn({ name: 'created_at', type: 'timestamp with time zone' })
  createdAt!: Date

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp with time zone' })
  updatedAt!: Date

  toDomain(): Frequency {
    return new Frequency({
      uid: this.uid,
      measuredBy: this.measuredBy,
      source: this.source,
      sweepLength: this.sweepLength,
      measuredAt: this.measuredAt,
      frequencyWeightings: this.frequencyWeightings,
      targetLevel: this.targetLevel,
      note: this.note,
      smoothing: this.smoothing,
      frequencies: this.frequencies,
      highestFrequency: this.highestFrequency,
      lowestFrequency: this.lowestFrequency,
      spls: this.spls,
      highestSpl: this.highestSpl,
      lowestSpl: this.lowestSpl,
      phases: this.phases,
      cabinetUid: this.cabinetUid,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    })
  }

  static fromDomain(frequency: Frequency): FrequencyTypeormEntity {
    const entity = new FrequencyTypeormEntity()
    entity.uid = frequency.uid
    entity.measuredBy = frequency.measuredBy
    entity.source = frequency.source
    entity.sweepLength = frequency.sweepLength
    entity.measuredAt = frequency.measuredAt
    entity.frequencyWeightings = frequency.frequencyWeightings
    entity.targetLevel = frequency.targetLevel
    entity.note = frequency.note
    entity.smoothing = frequency.smoothing
    entity.frequencies = frequency.frequencies
    entity.highestFrequency = frequency.highestFrequency
    entity.lowestFrequency = frequency.lowestFrequency
    entity.spls = frequency.spls
    entity.highestSpl = frequency.highestSpl
    entity.lowestSpl = frequency.lowestSpl
    entity.phases = frequency.phases
    entity.cabinetUid = frequency.cabinetUid

    return entity
  }
}
