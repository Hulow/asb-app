export class RegisterDriverCommand {
  constructor(
    public readonly brandName: string,
    public readonly productName: string,
    public readonly driverType: string,
    public readonly manufacturingYear: number,
    public readonly nominalDiameter: number,
    public readonly nominalImpedance: number,
    public readonly continuousPowerHandling: number,
    public readonly ownerUid: string,
    public readonly cabinetUid: string,
  ) {}

  static from(data: {
    brandName: string
    productName: string
    driverType: string
    manufacturingYear: number
    nominalDiameter: number
    nominalImpedance: number
    continuousPowerHandling: number
    ownerUid: string
    cabinetUid: string
  }): RegisterDriverCommand {
    return new RegisterDriverCommand(
      data.brandName,
      data.productName,
      data.driverType,
      data.manufacturingYear,
      data.nominalDiameter,
      data.nominalImpedance,
      data.continuousPowerHandling,
      data.ownerUid,
      data.cabinetUid,
    )
  }
}
