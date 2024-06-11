import { injectable } from 'inversify'

export enum EntityTable {
  Owner = 'owner',
  Cabinet = 'cabinet',
  Frequency = 'frequency',
  Impedance = 'impedance',
  Driver = 'driver',
}

export enum OwnerColumnNames {
  Uid = 'owner_uid',
  FirstName = 'first_name',
  LastName = 'last_name',
  Ownername = 'ownername',
  Email = 'email',
  PhoneNumber = 'phone_number',
  City = 'city',
  Description = 'description',
  CreatedAt = 'created_at',
  UpdatedAt = 'updated_at',
}

export enum DriverColumnNames {
  uid = 'driver_uid',
  brandName = 'brand_name',
  productName = 'product_name',
  driverType = 'driver_type',
  nominalDiameter = 'nominal_diameter',
  nominalImpedance = 'nominal_impedance',
  continuousPowerHandling = 'continuous_power_handling',
  cabinetUid = 'cabinet_uid',
  createdAt = 'created_at',
  updatedAt = 'updated_at',
}

export enum CabinetColumnNames {
  Uid = 'cabinet_uid',
  BrandName = 'brand_name',
  ProductName = 'product_name',
  EnclosureType = 'enclosure_type',
  Weight = 'weight',
  Dimension = 'dimension',
  Description = 'description',
  OwnerUid = 'owner_uid',
  CreatedAt = 'created_at',
  UpdatedAt = 'updated_at',
}

export enum FrequencyColumnNames {
  Uid = 'frequency_uid',
  MeasuredBy = 'measured_by',
  Source = 'source',
  SweepLength = 'sweep_length',
  MeasuredAt = 'measured_at',
  FrequencyWeightings = 'frequency_weightings',
  TargetLevel = 'target_level',
  Note = 'note',
  Smoothing = 'smoothing',
  Frequencies = 'frequencies',
  HighestFrequency = 'highest_frequency',
  LowestFrequency = 'lowest_frequency',
  Spls = 'spls',
  HighestSpl = 'highest_spl',
  LowestSpl = 'lowest_spl',
  Phases = 'phases',
  CabinetUid = 'cabinet_uid',
  CreatedAt = 'created_at',
  UpdatedAt = 'updated_at',
}

export enum ImpedanceColumnNames {
  Uid = 'impedance_uid',
  Source = 'source',
  PistonDiameter = 'piston_diameter',
  ResonanceFrequency = 'resonance_frequency',
  DcResistance = 'dc_resistance',
  AcResistance = 'ac_resistance',
  MechanicalDamping = 'mechanical_damping',
  ElectricalDamping = 'electrical_damping',
  TotalDamping = 'total_damping',
  EquivalenceCompliance = 'equivalence_compliance',
  VoiceCoilInductance = 'voice_coil_inductance',
  Efficiency = 'efficiency',
  Sensitivity = 'sensitivity',
  ConeMass = 'cone_mass',
  SuspensionCompliance = 'suspension_compliance',
  ForceFactor = 'force_factor',
  KR = 'kr',
  XR = 'xr',
  KI = 'ki',
  XI = 'xi',
  CabinetUid = 'cabinet_uid',
  Frequencies = 'frequencies',
  Impedances = 'impedances',
  Phases = 'phases',
  CreatedAt = 'created_at',
  UpdatedAt = 'updated_at',
}

type ColumnesNames =
  | OwnerColumnNames
  | DriverColumnNames
  | CabinetColumnNames
  | FrequencyColumnNames
  | ImpedanceColumnNames

interface TableAndColumNames {
  columns: ColumnesNames[]
  name: EntityTable
}

interface MappedTableAndColumnName {
  column: ColumnesNames
  table: EntityTable
}

@injectable()
export class MeasurementQueryMapper {
  generateSelectQuery(): string {
    return this._generateMappedColumnNames()
      .map(item => this._mapSelectQuery(item.column, item.table))
      .join('\n')
  }

  generateGroupByQuery(): string {
    return this._generateMappedColumnNames()
      .map(item => this._mapGroupByQuery(item.column, item.table))
      .join('\n')
      .slice(0, -1)
  }

  generateDriverQuery(): string {
    return this._generatedMappedDriver()
      .map(item => this._mapDriverQuery(item.key, item.column, item.name))
      .join('\n')
  }

  private _generateMappedColumnNames(): MappedTableAndColumnName[] {
    const mappedColumnNames: MappedTableAndColumnName[] = []
    for (const table of this._generateTables()) {
      for (const column of table.columns) {
        mappedColumnNames.push({ column: column, table: table.name })
      }
    }
    return mappedColumnNames
  }

  private _generateTables(): TableAndColumNames[] {
    return [
      { columns: Object.values(CabinetColumnNames), name: EntityTable.Cabinet },
      {
        columns: Object.values(FrequencyColumnNames),
        name: EntityTable.Frequency,
      },
      {
        columns: Object.values(ImpedanceColumnNames),
        name: EntityTable.Impedance,
      },
    ]
  }

  private _mapSelectQuery(column: ColumnesNames, name: EntityTable) {
    return `${name}.${column} as ${name}_${column},`
  }

  private _mapGroupByQuery(column: ColumnesNames, name: EntityTable): string {
    return `${name}.${column},`
  }

  private _mapDriverQuery(
    key: string,
    column: DriverColumnNames,
    tableName: string,
  ): string {
    return `', ${key}: ' || ${tableName}.${column} ||`
  }

  _generatedMappedDriver(): {
    key: string
    column: DriverColumnNames
    name: EntityTable
  }[] {
    const driverTable = {
      keys: Object.keys(DriverColumnNames),
      columns: Object.values(DriverColumnNames),
      name: EntityTable.Driver,
    }

    const mappedDriverTable: {
      key: string
      column: DriverColumnNames
      name: EntityTable
    }[] = []
    let counter = 0
    for (const key of driverTable.keys) {
      mappedDriverTable.push({
        key: key,
        column: driverTable.columns[counter],
        name: EntityTable.Driver,
      })
      counter++
    }
    return mappedDriverTable
  }
}
