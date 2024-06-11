import { DomainError } from '../../../../shared/domain/error'

export class ImpedanceNotFound extends DomainError {
  constructor(cabinetUid: string) {
    super(`Unable to find impedance from cabinet ${cabinetUid}`)
  }
}

export class ImpedanceParameterNotFound extends DomainError {
  constructor(parameter: string) {
    super(`${parameter} parameter from impedance not found`)
  }
}

export class UnableToExtractImpedanceData extends DomainError {
  constructor() {
    super('Unable to extract impedance data')
  }
}
