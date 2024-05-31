export class RegisterImpedanceCommand {
    constructor(
      public readonly ownerUid: string,
      public readonly cabinetUid: string,
      public readonly driverUid: string,
      public readonly measurements: string,
    ) {}
  
    static from(data: {
        ownerUid: string
        cabinetUid: string
        driverUid: string
        measurements: string
    }): RegisterImpedanceCommand {
      return new RegisterImpedanceCommand(
        data.ownerUid,
        data.cabinetUid,
        data.driverUid,
        data.measurements
      )
    }
  }
