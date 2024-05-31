/* eslint-disable @typescript-eslint/no-unused-vars */
import { injectable } from 'inversify'
import { CabinetRepositoryOutputPort } from '../../../../core/application/ports/out/cabinet-repository.output-port'
import { Cabinet } from '../../../../core/domain/cabinet/cabinet'

@injectable()
export class InMemoryCabinetRepository implements CabinetRepositoryOutputPort {
  public cabinets: Cabinet[] = []
  public storedCabinets: Cabinet[] = []

  clean(): void {
    this.cabinets = []
    this.storedCabinets = []
  }

  add(cabinet: Cabinet): this {
    this.cabinets.push(cabinet)
    return this
  }

  toHaveBeenCalledWith(): Cabinet[] {
    return this.storedCabinets
  }

  async save(cabinet: Cabinet): Promise<Cabinet> {
    this.storedCabinets.push(cabinet)
    return Promise.resolve(this.cabinets[0])
  }

  async getByProductNameAndOwnerUid(
    productName: string,
    ownerUid: string,
  ): Promise<Cabinet | undefined> {
    return Promise.resolve(this.cabinets[0])
  }

  async getById(cabinetUid: string): Promise<Cabinet | undefined> {
    return Promise.resolve(this.cabinets[0])
  }

  async getAllCabinets(): Promise<Cabinet[] | undefined> {
    if (this.cabinets.length === 0) return Promise.resolve(undefined)
    return Promise.resolve(this.cabinets)
  }

  async getByOwnerUid(ownerUid: string): Promise<Cabinet[] | undefined> {
    return Promise.resolve(this.cabinets)
  }
}
