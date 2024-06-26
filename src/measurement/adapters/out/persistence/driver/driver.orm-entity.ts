import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm'
import { Driver } from '../../../../core/domain/driver/driver'

@Entity({ name: 'driver' })
export class DriverTypeormEntity {
  @PrimaryColumn({ name: 'driver_uid', type: 'uuid', update: false })
  uid!: string

  @Column({ name: 'brand_name', type: 'varchar' })
  brandName!: string

  @Column({ name: 'product_name', type: 'varchar' })
  productName!: string

  @Column({ name: 'driver_type', type: 'varchar' })
  driverType!: string

  @Column({ name: 'nominal_diameter', type: 'float' })
  nominalDiameter!: number

  @Column({ name: 'nominal_impedance', type: 'float' })
  nominalImpedance!: number

  @Column({ name: 'continuous_power_handling', type: 'float' })
  continuousPowerHandling!: number

  @Column({ name: 'cabinet_uid', type: 'uuid' })
  cabinetUid!: string

  @CreateDateColumn({ name: 'created_at', type: 'timestamp with time zone' })
  createdAt!: Date

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp with time zone' })
  updatedAt!: Date

  toDomain(): Driver {
    return new Driver({
      uid: this.uid,
      brandName: this.brandName,
      productName: this.productName,
      driverType: this.driverType,
      nominalDiameter: this.nominalDiameter,
      nominalImpedance: this.nominalImpedance,
      continuousPowerHandling: this.continuousPowerHandling,
      cabinetUid: this.cabinetUid,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    })
  }

  static fromDomain(driver: Driver): DriverTypeormEntity {
    const entity = new DriverTypeormEntity()
    entity.uid = driver.uid
    entity.brandName = driver.brandName
    entity.productName = driver.productName
    entity.driverType = driver.driverType
    entity.nominalDiameter = driver.nominalDiameter
    entity.nominalImpedance = driver.nominalImpedance
    entity.continuousPowerHandling = driver.continuousPowerHandling
    entity.cabinetUid = driver.cabinetUid
    return entity
  }
}
