/* eslint-disable @typescript-eslint/no-unused-vars */
import { injectable } from 'inversify'
import { DriverRepositoryOutputPort } from '../../../../core/application/ports/out/driver-repository.output-port'
import { Driver } from '../../../../core/domain/driver/driver'

@injectable()
export class InMemoryDriverRepository implements DriverRepositoryOutputPort {
  public drivers: Driver[] = []
  public storedDrivers: Driver[] = []

  clean(): void {
    this.drivers = []
    this.storedDrivers = []
  }

  add(driver: Driver): this {
    this.drivers.push(driver)
    return this
  }

  toHaveBeenCalledWith(): Driver[] {
    return this.storedDrivers
  }

  save(driver: Driver) {
    this.storedDrivers.push(driver)
    return Promise.resolve(this.drivers[0])
  }

  async getByProductNameAndCabinetUid(productName: string, cabinetUid: string) {
    return Promise.resolve(this.drivers)
  }

  async getByCabinetUid(cabinetUid: string) {
    return Promise.resolve(this.drivers)
  }

  async getAllDrivers(): Promise<Driver[] | undefined> {
    if (this.drivers.length === 0) return Promise.resolve(undefined)
    return Promise.resolve(this.drivers)
  }
}
