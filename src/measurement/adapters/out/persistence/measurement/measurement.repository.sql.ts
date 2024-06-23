import { injectable } from 'inversify'
import { MeasurementRepositoryOutputPort } from '../../../../core/application/ports/out/measurement-repository.output-port'
import { PostgresDataSource } from '../../../../../shared/adapters/out/postgres-datasource'
import { container } from '../../../../../di-container'
import { Measurement } from '../../../../core/domain/measurement/measurement'
import {
  MeasurementRepositoryMapperProps,
  MeasurementRepositoryMapper,
} from './measurement.repository.mapper'
import { Cabinet } from '../../../../core/domain/cabinet/cabinet'
import { Driver } from '../../../../core/domain/driver/driver'
import { Frequency } from '../../../../core/domain/frequency/frequency'
import { Impedance } from '../../../../core/domain/impedance/impedance'

@injectable()
export class SqlMeasurementRepository
  implements MeasurementRepositoryOutputPort
{
  constructor(
    private readonly _datasource = container.get(PostgresDataSource),
  ) {}

  async getMeasurementByCabinetUid(
    cabinetUid: string,
  ): Promise<Measurement | undefined> {
    const records: MeasurementRepositoryMapperProps[] = await this._datasource
      .query(`
    SELECT 
    c.cabinet_uid AS cabinet_cabinet_uid,
    c.brand_name AS cabinet_brand_name,
    c.product_name AS cabinet_product_name,
    c.enclosure_type AS cabinet_enclosure_type,
    c.weight AS cabinet_weight,
    c.dimension AS cabinet_dimension,
    c.description AS cabinet_description,
    c.created_at AS cabinet_created_at,
    c.updated_at AS cabinet_updated_at,
    d.driver_uid AS driver_driver_uid,
    d.brand_name AS driver_brand_name,
    d.product_name AS driver_product_name,
    d.driver_type AS driver_driver_type,
    d.nominal_diameter AS driver_nominal_diameter,
    d.nominal_impedance AS driver_nominal_impedance,
    d.continuous_power_handling AS driver_continuous_power_handling,
    d.created_at AS driver_created_at,
    d.updated_at AS driver_updated_at,
    f.frequency_uid AS frequency_frequency_uid,
    f.measured_by AS frequency_measured_by,
    f.source AS frequency_source,
    f.sweep_length AS frequency_sweep_length,
    f.measured_at AS frequency_measured_at,
    f.frequency_weightings AS frequency_frequency_weightings,
    f.target_level AS frequency_target_level,
    f.note AS frequency_note,
    f.smoothing AS frequency_smoothing,
    f.frequencies AS frequency_frequencies,
    f.highest_frequency AS frequency_highest_frequency,
    f.lowest_frequency AS frequency_lowest_frequency,
    f.spls AS frequency_spls,
    f.highest_spl AS frequency_highest_spl,
    f.lowest_spl AS frequency_lowest_spl,
    f.phases AS frequency_phases,
    f.created_at AS frequency_created_at,
    f.updated_at AS frequency_updated_at,
    i.impedance_uid AS impedance_impedance_uid,
    i.source AS impedance_source,
    i.piston_diameter AS impedance_piston_diameter,
    i.resonance_frequency AS impedance_resonance_frequency,
    i.dc_resistance AS impedance_dc_resistance,
    i.ac_resistance AS impedance_ac_resistance,
    i.mechanical_damping AS impedance_mechanical_damping,
    i.electrical_damping AS impedance_electrical_damping,
    i.total_damping AS impedance_total_damping,
    i.equivalence_compliance AS impedance_equivalence_compliance,
    i.voice_coil_inductance AS impedance_voice_coil_inductance,
    i.efficiency AS impedance_efficiency,
    i.sensitivity AS impedance_sensitivity,
    i.cone_mass AS impedance_cone_mass,
    i.suspension_compliance AS impedance_suspension_compliance,
    i.force_factor AS impedance_force_factor,
    i.kr AS impedance_kr,
    i.xr AS impedance_xr,
    i.ki AS impedance_ki,
    i.xi AS impedance_xi,
    i.frequencies AS impedance_frequencies,
    i.highest_frequency AS impedance_highest_frequency,
    i.lowest_frequency AS impedance_lowest_frequency,
    i.impedances AS impedance_impedances,
    i.highest_impedance AS impedance_highest_impedance,
    i.lowest_impedance AS impedance_lowest_impedance,
    i.phases AS impedance_phases,
    i.highest_phase AS impedance_highest_phase,
    i.lowest_phase AS impedance_lowest_phase,
    i.created_at AS impedance_created_at,
    i.updated_at AS impedance_updated_at
  FROM 
    cabinet c
    LEFT JOIN driver d ON c.cabinet_uid = d.cabinet_uid
    LEFT JOIN frequency f ON c.cabinet_uid = f.cabinet_uid
    LEFT JOIN impedance i ON c.cabinet_uid = i.cabinet_uid AND d.driver_uid = i.driver_uid
  WHERE 
    c.cabinet_uid = '${cabinetUid}'
  ORDER BY 
    c.cabinet_uid, d.driver_uid, f.frequency_uid, i.impedance_uid;
    `)

    if (!records.length) return undefined
    let cabinet: Cabinet | undefined
    let frequency: Frequency | undefined
    const drivers: Driver[] = []
    const impedances: Impedance[] = []

    for (const record of records) {
      const data = MeasurementRepositoryMapper.map(record)
      if (!cabinet) cabinet = data.mapCabinet()
      if (!frequency) frequency = data.mapFrequency()
      drivers.push(data.mapDriver())
      impedances.push(data.mapImpedance())
    }

    return {
      cabinet,
      drivers,
      frequency,
      impedances,
    } as Measurement
  }
}
