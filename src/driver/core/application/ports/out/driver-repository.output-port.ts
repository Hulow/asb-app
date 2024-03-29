import { Driver } from '../../../domain/driver';

export interface DriverRepositoryOutputPort {
  save: (driver: Driver) => Promise<Driver>;
  getByProductNameAndCabinetUid: (productName: string, cabinetUid: string) => Promise<Driver[] | undefined>;
  getByCabinetUid: (cabinetUid: string) => Promise<Driver[] | undefined>;
}

export const DRIVER_REPOSITORY_OUTPUT_PORT = Symbol.for('DriverRepositoryOutputPort');
