import { Cabinet } from '../cabinet/cabinet'
import { Driver } from '../driver/driver'
import { Frequency } from '../frequency/frequency'
import { Impedance } from '../impedance/impedance'

export interface Measurement {
  cabinet: Cabinet
  drivers: Driver[]
  frequency: Frequency
  impedance: Impedance
}
