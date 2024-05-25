CREATE TABLE IF NOT EXISTS cabinet (
  cabinet_uid UUID NOT NULL PRIMARY KEY,
  brand_name VARCHAR NOT NULL,
  product_name VARCHAR NOT NULL,
  enclosure_type VARCHAR NOT NULL,
  weight FLOAT NOT NULL,
  dimension VARCHAR NOT NULL,
  manufacturing_year INTEGER NOT NULL,
  description VARCHAR NOT NULL,
  owner_uid UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  FOREIGN KEY (owner_uid) REFERENCES owner(owner_uid) ON DELETE CASCADE ON UPDATE CASCADE
);