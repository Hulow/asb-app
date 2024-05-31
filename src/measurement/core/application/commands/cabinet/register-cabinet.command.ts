export class RegisterCabinetCommand {
  constructor(
    public readonly brandName: string,
    public readonly productName: string,
    public readonly enclosureType: string,
    public readonly weight: number,
    public readonly dimension: string,
    public readonly manufacturingYear: number,
    public readonly description: string,
    public readonly ownerUid: string,
  ) {}

  static from(data: {
    brandName: string
    productName: string
    enclosureType: string
    weight: number
    dimension: string
    manufacturingYear: number
    description: string
    ownerUid: string
  }): RegisterCabinetCommand {
    return new RegisterCabinetCommand(
      data.brandName,
      data.productName,
      data.enclosureType,
      data.weight,
      data.dimension,
      data.manufacturingYear,
      data.description,
      data.ownerUid,
    )
  }
}
