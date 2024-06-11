import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm'
import { Impedance } from '../../../../core/domain/impedance/impedance'

@Entity({ name: 'impedance' })
export class ImpedanceTypeormEntity {
  @PrimaryColumn({ name: 'impedance_uid', type: 'uuid', update: false })
  uid!: string

  @Column({ name: 'source', type: 'varchar' })
  source!: string

  @Column({ name: 'piston_diameter', type: 'varchar' })
  pistonDiameter!: string

  @Column({ name: 'resonance_frequency', type: 'varchar' })
  resonanceFrequency!: string

  @Column({ name: 'dc_resistance', type: 'varchar' })
  dcResistance!: string

  @Column({ name: 'ac_resistance', type: 'varchar' })
  acResistance!: string

  @Column({ name: 'mechanical_damping', type: 'varchar' })
  mechanicalDamping!: string

  @Column({ name: 'electrical_damping', type: 'varchar' })
  electricalDamping!: string

  @Column({ name: 'total_damping', type: 'varchar' })
  totalDamping!: string

  @Column({ name: 'equivalence_compliance', type: 'varchar' })
  equivalenceCompliance!: string

  @Column({ name: 'voice_coil_inductance', type: 'varchar' })
  voiceCoilInductance!: string

  @Column({ name: 'efficiency', type: 'varchar' })
  efficiency!: string

  @Column({ name: 'sensitivity', type: 'varchar' })
  sensitivity!: string

  @Column({ name: 'cone_mass', type: 'varchar' })
  coneMass!: string

  @Column({ name: 'suspension_compliance', type: 'varchar' })
  suspensionCompliance!: string

  @Column({ name: 'force_factor', type: 'varchar' })
  forceFactor!: string

  @Column({ name: 'kr', type: 'varchar' })
  kR!: string

  @Column({ name: 'xr', type: 'varchar' })
  xR!: string

  @Column({ name: 'ki', type: 'varchar' })
  kI!: string

  @Column({ name: 'xi', type: 'varchar' })
  xI!: string

  @Column({ name: 'cabinet_uid', type: 'uuid' })
  cabinetUid!: string

  @Column({ name: 'frequencies', type: 'jsonb' })
  frequencies!: number[]

  @Column({ name: 'highest_frequency', type: 'float' })
  highestFrequency!: number

  @Column({ name: 'lowest_frequency', type: 'float' })
  lowestFrequency!: number

  @Column({ name: 'impedances', type: 'jsonb' })
  impedances!: number[]

  @Column({ name: 'phases', type: 'jsonb' })
  phases!: number[]

  @CreateDateColumn({ name: 'created_at', type: 'timestamp with time zone' })
  createdAt!: Date

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp with time zone' })
  updatedAt!: Date

  toDomain(): Impedance {
    return new Impedance({
      uid: this.uid,
      source: this.source,
      pistonDiameter: this.pistonDiameter,
      resonanceFrequency: this.resonanceFrequency,
      dcResistance: this.dcResistance,
      acResistance: this.acResistance,
      mechanicalDamping: this.mechanicalDamping,
      electricalDamping: this.electricalDamping,
      totalDamping: this.totalDamping,
      equivalenceCompliance: this.equivalenceCompliance,
      voiceCoilInductance: this.voiceCoilInductance,
      efficiency: this.efficiency,
      sensitivity: this.sensitivity,
      coneMass: this.coneMass,
      suspensionCompliance: this.suspensionCompliance,
      forceFactor: this.forceFactor,
      kR: this.kR,
      xR: this.xR,
      kI: this.kI,
      xI: this.xI,
      cabinetUid: this.cabinetUid,
      frequencies: this.frequencies,
      highestFrequency: this.highestFrequency,
      lowestFrequency: this.lowestFrequency,
      impedances: this.impedances,
      phases: this.phases,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    })
  }

  static fromDomain(impedance: Impedance): ImpedanceTypeormEntity {
    const entity = new ImpedanceTypeormEntity()
    entity.uid = impedance.uid
    entity.source = impedance.source
    entity.pistonDiameter = impedance.pistonDiameter
    entity.resonanceFrequency = impedance.resonanceFrequency
    entity.dcResistance = impedance.dcResistance
    entity.acResistance = impedance.acResistance
    entity.mechanicalDamping = impedance.mechanicalDamping
    entity.electricalDamping = impedance.electricalDamping
    entity.totalDamping = impedance.totalDamping
    entity.equivalenceCompliance = impedance.equivalenceCompliance
    entity.voiceCoilInductance = impedance.voiceCoilInductance
    entity.efficiency = impedance.efficiency
    entity.sensitivity = impedance.sensitivity
    entity.coneMass = impedance.coneMass
    entity.suspensionCompliance = impedance.suspensionCompliance
    entity.forceFactor = impedance.forceFactor
    entity.kR = impedance.kR
    entity.xR = impedance.xR
    entity.kI = impedance.kI
    entity.xI = impedance.xI
    entity.cabinetUid = impedance.cabinetUid
    entity.frequencies = impedance.frequencies
    entity.highestFrequency = impedance.highestFrequency
    entity.lowestFrequency = impedance.lowestFrequency
    entity.impedances = impedance.impedances
    entity.phases = impedance.phases
    return entity
  }
}
