import { inject, injectable } from 'inversify';

import { GetMeasurementPerCabinetInputPort } from '../ports/in/get-measurement-per-cabinet.input-port';
import {
  CABINET_REPOSITORY_OUTPUT_PORT,
  CabinetRepositoryOutputPort,
} from '../../../../cabinet/core/application/ports/out/cabinet-repository.output-port';
import {
  DRIVER_REPOSITORY_OUTPUT_PORT,
  DriverRepositoryOutputPort,
} from '../../../../driver/core/application/ports/out/driver-repository.output-port';
import {
  IMPEDANCE_REPOSITORY_OUTPUT_PORT,
  ImpedanceRepositoryOutputPort,
} from '../../../../impedance/core/application/ports/out/impedance-repository.output-port';
import {
  FREQUENCY_REPOSITORY_OUTPUT_PORT,
  FrequencyRepositoryOutputPort,
} from '../../../../frequency/core/application/ports/out/frequency-repository.output-port';
import { Measurement } from '../../domain/measurement';
import { Cabinet } from '../../../../cabinet/core/domain/cabinet';
import { CabinetDoesNotExist } from '../../../../cabinet/core/domain/errors';
import { Driver } from '../../../../driver/core/domain/driver';
import { DriversNotFound } from '../../../../driver/core/domain/errors';
import { Frequency } from '../../../../frequency/core/domain/frequency';
import { FrequencyNotFound } from '../../../../frequency/core/domain/errors';
import { Impedance } from '../../../../impedance/core/domain/impedance';
import { ImpedanceNotFound } from '../../../../impedance/core/domain/errors';

@injectable()
export class GetMeasurementPerCabinetService implements GetMeasurementPerCabinetInputPort {
  constructor(
    @inject(CABINET_REPOSITORY_OUTPUT_PORT) private readonly cabinetRepository: CabinetRepositoryOutputPort,
    @inject(DRIVER_REPOSITORY_OUTPUT_PORT) private readonly driverRepository: DriverRepositoryOutputPort,
    @inject(IMPEDANCE_REPOSITORY_OUTPUT_PORT) private readonly impedanceRepository: ImpedanceRepositoryOutputPort,
    @inject(FREQUENCY_REPOSITORY_OUTPUT_PORT) private readonly frequencyRepository: FrequencyRepositoryOutputPort,
  ) {}

  async handler(cabinetUid: string): Promise<Measurement> {
    return await this.mapMeasurement(cabinetUid);
  }

  private async mapMeasurement(cabinetUid: string): Promise<Measurement> {
    return {
      cabinet: await this.getCabinet(cabinetUid),
      drivers: await this.getDrivers(cabinetUid),
      frequency: await this.getFrequency(cabinetUid),
      impedance: await this.getImpedance(cabinetUid),
    };
  }

  private async getCabinet(cabinetUid: string): Promise<Cabinet> {
    const cabinet = await this.cabinetRepository.getById(cabinetUid);
    if (!cabinet) throw new CabinetDoesNotExist(cabinetUid);
    return cabinet;
  }

  private async getDrivers(cabinetUid: string): Promise<Driver[]> {
    const drivers = await this.driverRepository.getByCabinetUid(cabinetUid);
    if (!drivers) throw new DriversNotFound();
    return drivers;
  }

  private async getFrequency(cabinetUid: string): Promise<Frequency> {
    const frequency = await this.frequencyRepository.getByCabinetUid(cabinetUid);
    if (!frequency) throw new FrequencyNotFound(cabinetUid);
    return frequency;
  }

  private async getImpedance(cabinetUid: string): Promise<Impedance> {
    const impedance = await this.impedanceRepository.getByCabinetUid(cabinetUid);
    if (!impedance) throw new ImpedanceNotFound(cabinetUid);
    return impedance;
  }
}
