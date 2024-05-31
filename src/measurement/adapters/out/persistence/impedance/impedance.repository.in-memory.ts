/* eslint-disable @typescript-eslint/no-unused-vars */
import { injectable } from 'inversify'
import { ImpedanceRepositoryOutputPort } from '../../../../core/application/ports/out/impedance-repository.output-port'
import { Impedance } from '../../../../core/domain/impedance/impedance'

@injectable()
export class InMemoryImpedanceRepository
  implements ImpedanceRepositoryOutputPort
{
  public impedances: Impedance[] = []
  public storedImpedances: Impedance[] = []

  clean(): void {
    this.impedances = []
  }

  add(impedance: Impedance): this {
    this.impedances.push(impedance)
    return this
  }

  toHaveBeenCalledWith(): Impedance[] {
    return this.storedImpedances
  }

  save(impedance: Impedance) {
    this.storedImpedances.push(impedance)
    return Promise.resolve(this.impedances[0])
  }

  async getByCabinetUid(cabinetUid: string) {
    return Promise.resolve(this.impedances[0])
  }
}
