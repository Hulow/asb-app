import { Measurement } from '../../../../core/domain/measurement/measurement'
import { Cabinet } from '../../../../core/domain/cabinet/cabinet'
import { Frequency } from '../../../../core/domain/frequency/frequency'
import { Driver } from '../../../../core/domain/driver/driver'
import { Impedance } from '../../../../core/domain/impedance/impedance'

export interface MeasurementRepositoryMapperProps {
  cabinet_cabinet_uid: string
  cabinet_brand_name: string
  cabinet_product_name: string
  cabinet_enclosure_type: string
  cabinet_weight: number
  cabinet_dimension: string
  cabinet_manufacturing_year: number
  cabinet_description: string
  cabinet_owner_uid: string
  cabinet_created_at: Date
  cabinet_updated_at: Date
  frequency_frequency_uid: string
  frequency_measured_by: string
  frequency_source: string
  frequency_sweep_length: string
  frequency_measured_at: string
  frequency_frequency_weightings: string
  frequency_target_level: string
  frequency_note: string
  frequency_smoothing: string
  frequency_frequencies: number[]
  frequency_spls: number[]
  frequency_highest_spl: number
  frequency_lowest_spl: number
  frequency_phases: number[]
  frequency_cabinet_uid: string
  frequency_created_at: Date
  frequency_updated_at: Date
  impedance_impedance_uid: string
  impedance_source: string
  impedance_piston_diameter: string
  impedance_resonance_frequency: string
  impedance_dc_resistance: string
  impedance_ac_resistance: string
  impedance_mechanical_damping: string
  impedance_electrical_damping: string
  impedance_total_damping: string
  impedance_equivalence_compliance: string
  impedance_voice_coil_inductance: string
  impedance_efficiency: string
  impedance_sensitivity: string
  impedance_cone_mass: string
  impedance_suspension_compliance: string
  impedance_force_factor: string
  impedance_kr: string
  impedance_xr: string
  impedance_ki: string
  impedance_xi: string
  impedance_cabinet_uid: string
  impedance_frequencies: number[]
  impedance_impedances: number[]
  impedance_phases: number[]
  impedance_created_at: Date
  impedance_updated_at: Date
  string_agg: string
}

export class MeasurementRepositoryMapper {
  readonly cabinet_cabinet_uid: string
  readonly cabinet_brand_name: string
  readonly cabinet_product_name: string
  readonly cabinet_enclosure_type: string
  readonly cabinet_weight: number
  readonly cabinet_dimension: string
  readonly cabinet_manufacturing_year: number
  readonly cabinet_description: string
  readonly cabinet_owner_uid: string
  readonly cabinet_created_at: Date
  readonly cabinet_updated_at: Date
  readonly frequency_frequency_uid: string
  readonly frequency_measured_by: string
  readonly frequency_source: string
  readonly frequency_sweep_length: string
  readonly frequency_measured_at: string
  readonly frequency_frequency_weightings: string
  readonly frequency_target_level: string
  readonly frequency_note: string
  readonly frequency_smoothing: string
  readonly frequency_frequencies: number[]
  readonly frequency_spls: number[]
  readonly frequency_highest_spl: number
  readonly frequency_lowest_spl: number
  readonly frequency_phases: number[]
  readonly frequency_cabinet_uid: string
  readonly frequency_created_at: Date
  readonly frequency_updated_at: Date
  readonly impedance_impedance_uid: string
  readonly impedance_source: string
  readonly impedance_piston_diameter: string
  readonly impedance_resonance_frequency: string
  readonly impedance_dc_resistance: string
  readonly impedance_ac_resistance: string
  readonly impedance_mechanical_damping: string
  readonly impedance_electrical_damping: string
  readonly impedance_total_damping: string
  readonly impedance_equivalence_compliance: string
  readonly impedance_voice_coil_inductance: string
  readonly impedance_efficiency: string
  readonly impedance_sensitivity: string
  readonly impedance_cone_mass: string
  readonly impedance_suspension_compliance: string
  readonly impedance_force_factor: string
  readonly impedance_kr: string
  readonly impedance_xr: string
  readonly impedance_ki: string
  readonly impedance_xi: string
  readonly impedance_cabinet_uid: string
  readonly impedance_frequencies: number[]
  readonly impedance_impedances: number[]
  readonly impedance_phases: number[]
  readonly impedance_created_at: Date
  readonly impedance_updated_at: Date
  readonly string_agg: string

  constructor(params: MeasurementRepositoryMapperProps) {
    this.cabinet_cabinet_uid = params.cabinet_cabinet_uid
    this.cabinet_brand_name = params.cabinet_brand_name
    this.cabinet_product_name = params.cabinet_product_name
    this.cabinet_enclosure_type = params.cabinet_enclosure_type
    this.cabinet_weight = params.cabinet_weight
    this.cabinet_dimension = params.cabinet_dimension
    this.cabinet_manufacturing_year = params.cabinet_manufacturing_year
    this.cabinet_description = params.cabinet_description
    this.cabinet_owner_uid = params.cabinet_owner_uid
    this.cabinet_created_at = params.cabinet_created_at
    this.cabinet_updated_at = params.cabinet_updated_at
    this.frequency_frequency_uid = params.frequency_frequency_uid
    this.frequency_measured_by = params.frequency_measured_by
    this.frequency_source = params.frequency_source
    this.frequency_sweep_length = params.frequency_sweep_length
    this.frequency_measured_at = params.frequency_measured_at
    this.frequency_frequency_weightings = params.frequency_frequency_weightings
    this.frequency_target_level = params.frequency_target_level
    this.frequency_note = params.frequency_note
    this.frequency_smoothing = params.frequency_smoothing
    this.frequency_frequencies = params.frequency_frequencies
    this.frequency_spls = params.frequency_spls
    this.frequency_highest_spl = params.frequency_highest_spl
    this.frequency_lowest_spl = params.frequency_lowest_spl
    this.frequency_phases = params.frequency_phases
    this.frequency_cabinet_uid = params.frequency_cabinet_uid
    this.frequency_created_at = params.frequency_created_at
    this.frequency_updated_at = params.frequency_updated_at
    this.impedance_impedance_uid = params.impedance_impedance_uid
    this.impedance_source = params.impedance_source
    this.impedance_piston_diameter = params.impedance_piston_diameter
    this.impedance_resonance_frequency = params.impedance_resonance_frequency
    this.impedance_dc_resistance = params.impedance_dc_resistance
    this.impedance_ac_resistance = params.impedance_ac_resistance
    this.impedance_mechanical_damping = params.impedance_mechanical_damping
    this.impedance_electrical_damping = params.impedance_electrical_damping
    this.impedance_total_damping = params.impedance_total_damping
    this.impedance_equivalence_compliance =
      params.impedance_equivalence_compliance
    this.impedance_voice_coil_inductance =
      params.impedance_voice_coil_inductance
    this.impedance_efficiency = params.impedance_efficiency
    this.impedance_sensitivity = params.impedance_sensitivity
    this.impedance_cone_mass = params.impedance_cone_mass
    this.impedance_suspension_compliance =
      params.impedance_suspension_compliance
    this.impedance_force_factor = params.impedance_force_factor
    this.impedance_kr = params.impedance_kr
    this.impedance_xr = params.impedance_xr
    this.impedance_ki = params.impedance_ki
    this.impedance_xi = params.impedance_xi
    this.impedance_cabinet_uid = params.impedance_cabinet_uid
    this.impedance_frequencies = params.impedance_frequencies
    this.impedance_impedances = params.impedance_impedances
    this.impedance_phases = params.impedance_phases
    this.impedance_created_at = params.impedance_created_at
    this.impedance_updated_at = params.impedance_updated_at
    this.string_agg = params.string_agg
  }

  mapMeasurement(): Measurement {
    return {
      cabinet: this._mapCabinet(),
      frequency: this._mapFrequency(),
      impedance: this._mapImpedance(),
      drivers: this._mapDrivers(),
    }
  }

  private _mapCabinet(): Cabinet {
    return {
      uid: this.cabinet_cabinet_uid,
      brandName: this.cabinet_brand_name,
      productName: this.cabinet_product_name,
      enclosureType: this.cabinet_enclosure_type,
      weight: this.cabinet_weight,
      dimension: this.cabinet_dimension,
      manufacturingYear: this.cabinet_manufacturing_year,
      description: this.cabinet_description,
      ownerUid: this.cabinet_owner_uid,
      createdAt: new Date(this.cabinet_created_at),
      updatedAt: new Date(this.cabinet_updated_at),
    }
  }

  private _mapFrequency(): Frequency {
    return {
      uid: this.frequency_frequency_uid,
      measuredBy: this.frequency_measured_by,
      source: this.frequency_source,
      sweepLength: this.frequency_sweep_length,
      measuredAt: this.frequency_measured_at,
      frequencyWeightings: this.frequency_frequency_weightings,
      targetLevel: this.frequency_target_level,
      note: this.frequency_note,
      smoothing: this.frequency_smoothing,
      frequencies: this.frequency_frequencies,
      spls: this.frequency_spls,
      highestSpl: this.frequency_highest_spl,
      lowestSpl: this.frequency_lowest_spl,
      phases: this.frequency_phases,
      cabinetUid: this.frequency_cabinet_uid,
      createdAt: this.frequency_created_at,
      updatedAt: this.frequency_updated_at,
    }
  }

  private _mapImpedance(): Impedance {
    return {
      uid: this.impedance_impedance_uid,
      source: this.impedance_source,
      pistonDiameter: this.impedance_piston_diameter,
      resonanceFrequency: this.impedance_resonance_frequency,
      dcResistance: this.impedance_dc_resistance,
      acResistance: this.impedance_ac_resistance,
      mechanicalDamping: this.impedance_mechanical_damping,
      electricalDamping: this.impedance_electrical_damping,
      totalDamping: this.impedance_total_damping,
      equivalenceCompliance: this.impedance_equivalence_compliance,
      voiceCoilInductance: this.impedance_voice_coil_inductance,
      efficiency: this.impedance_efficiency,
      sensitivity: this.impedance_sensitivity,
      coneMass: this.impedance_cone_mass,
      suspensionCompliance: this.impedance_suspension_compliance,
      forceFactor: this.impedance_force_factor,
      kR: this.impedance_kr,
      xR: this.impedance_xr,
      xI: this.impedance_xi,
      kI: this.impedance_ki,
      frequencies: this.impedance_frequencies,
      impedances: this.impedance_impedances,
      phases: this.impedance_phases,
      cabinetUid: this.impedance_cabinet_uid,
      createdAt: this.impedance_created_at,
      updatedAt: this.impedance_updated_at,
    }
  }

  private _mapDrivers(): Driver[] {
    const driverlist: Driver[] = []
    const drivers: string[] = this.string_agg.split('},')
    for (const driver of drivers) {
      const driverProps = driver.split(',')
      const keyAndValues = driverProps.map(prop => prop.split(': '))
      const d = new Map()
      for (const keyAndValue of keyAndValues) {
        if (keyAndValue.length === 2)
          d.set(keyAndValue[0].trim(), keyAndValue[1])
      }
      driverlist.push(Object.fromEntries(d) as Driver)
    }
    return driverlist
  }
}
