import { DomainError } from '../../../../shared/domain/error'

export class MeasurementNotFound extends DomainError {
  constructor(cabinetUid: string) {
    super(`Measurement from cabinet ${cabinetUid} does not exist`)
  }
}
