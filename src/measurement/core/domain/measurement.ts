import { Cabinet } from '../../../cabinet/core/domain/cabinet';
import { Driver } from '../../../driver/core/domain/driver';
import { Frequency } from '../../../frequency/core/domain/frequency';
import { Impedance } from '../../../impedance/core/domain/impedance';

export interface Measurement {
  cabinet: Cabinet;
  drivers: Driver[];
  frequency: Frequency;
  impedance: Impedance;
}
