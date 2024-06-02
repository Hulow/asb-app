export class GetMeasurementQuery {
  constructor(public readonly cabinetUid: string) {}

  static from(data: { cabinetUid: string }): GetMeasurementQuery {
    return new GetMeasurementQuery(data.cabinetUid)
  }
}
