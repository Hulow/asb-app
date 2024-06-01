import { Cabinet } from '../../../domain/cabinet/cabinet'
import { Driver } from '../../../domain/driver/driver'
import { Owner } from '../../../domain/owner/owner'

export class GetCabinetQueryResult {
  map(
    owners: Owner[],
    cabinets: Cabinet[],
    drivers: Driver[],
  ): CabinetQueryResult[] {
    const cabinetQueryResult: CabinetQueryResult[] = []
    for (const cabinet of cabinets) {
      const foundOwner = owners.filter(owner => owner.uid === cabinet.ownerUid)
      const foundDrivers = drivers.filter(
        driver => driver.cabinetUid === cabinet.uid,
      )
      cabinetQueryResult.push({
        cabinet,
        owner: foundOwner[0],
        drivers: foundDrivers,
      })
    }

    return cabinetQueryResult
  }
}

export class CabinetQueryResult {
  readonly cabinet: Cabinet
  readonly owner: Owner
  readonly drivers: Driver[]

  constructor(params: { cabinet: Cabinet; owner: Owner; drivers: Driver[] }) {
    this.cabinet = params.cabinet
    this.owner = params.owner
    this.drivers = params.drivers
  }
}
