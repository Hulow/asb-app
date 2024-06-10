import { DomainEntity, EntityProps } from '../../../../shared/domain/entity'

export interface DriverProps {
  brandName: string
  productName: string
  driverType: string
  nominalDiameter: number
  nominalImpedance: number
  continuousPowerHandling: number
  cabinetUid: string
}

export class Driver extends DomainEntity {
  readonly brandName: string
  readonly productName: string
  readonly driverType: string
  readonly nominalDiameter: number
  readonly nominalImpedance: number
  readonly continuousPowerHandling: number
  readonly cabinetUid: string

  constructor(props: DriverProps & EntityProps) {
    super(props)
    this.brandName = props.brandName
    this.productName = props.productName
    this.driverType = props.driverType
    this.nominalDiameter = props.nominalDiameter
    this.nominalImpedance = props.nominalImpedance
    this.continuousPowerHandling = props.continuousPowerHandling
    this.cabinetUid = props.cabinetUid
  }
}
