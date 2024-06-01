/* eslint-disable @typescript-eslint/no-unused-vars */
import { injectable } from 'inversify'
import { ImpulseRepositoryOutputPort } from '../../../../core/application/ports/out/impulse-repository.output-port'
import { Impulse } from '../../../../core/domain/impulse/impulse'

@injectable()
export class InMemoryImpulseRepository implements ImpulseRepositoryOutputPort {
  public impulses: Impulse[] = []
  public storedImpulses: Impulse[] = []

  clean(): void {
    this.impulses = []
    this.storedImpulses = []
  }

  add(impulse: Impulse): this {
    this.impulses.push(impulse)
    return this
  }

  toHaveBeenCalledWith(): Impulse[] {
    return this.storedImpulses
  }

  save(impulse: Impulse) {
    this.storedImpulses.push(impulse)
    return Promise.resolve(this.impulses[0])
  }

  async getByCabinetUid(cabinetUid: string) {
    return Promise.resolve(this.impulses[0])
  }
}
