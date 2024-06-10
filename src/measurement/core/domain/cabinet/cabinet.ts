import { DomainEntity, EntityProps } from '../../../../shared/domain/entity'

export interface CabinetProps {
  brandName: string
  productName: string
  enclosureType: string
  weight: number
  dimension: string
  description: string
  ownerUid: string
}

export class Cabinet extends DomainEntity {
  readonly brandName: string
  readonly productName: string
  readonly enclosureType: string
  readonly weight: number
  readonly dimension: string
  readonly description: string
  readonly ownerUid: string

  constructor(props: CabinetProps & EntityProps) {
    super(props)

    this.brandName = props.brandName
    this.productName = props.productName
    this.enclosureType = props.enclosureType
    this.weight = props.weight
    this.dimension = props.dimension
    this.description = props.description
    this.ownerUid = props.ownerUid
  }
}
