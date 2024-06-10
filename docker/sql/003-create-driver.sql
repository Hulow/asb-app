CREATE TABLE IF NOT EXISTS driver (
  driver_uid UUID NOT NULL PRIMARY KEY,
  brand_name VARCHAR NOT NULL,
  product_name VARCHAR NOT NULL,
  driver_type VARCHAR NOT NULL,
  nominal_diameter FLOAT NOT NULL,
  nominal_impedance FLOAT NOT NULL,
  continuous_power_handling FLOAT NOT NULL,
  cabinet_uid UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  FOREIGN KEY (cabinet_uid) REFERENCES cabinet(cabinet_uid) ON DELETE CASCADE ON UPDATE CASCADE
);