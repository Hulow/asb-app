CREATE TABLE IF NOT EXISTS impulse (
  impulse_uid UUID NOT NULL PRIMARY KEY,
  measured_by VARCHAR NOT NULL,
  source VARCHAR NOT NULL,
  measured_at VARCHAR NOT NULL,
  sweep_length VARCHAR NOT NULL,
  response_window VARCHAR NOT NULL,
  note VARCHAR NOT NULL,
  peak_value_before_initialization VARCHAR NOT NULL,
  peak_index VARCHAR NOT NULL,
  response_length VARCHAR NOT NULL,
  sample_interval VARCHAR NOT NULL,
  start_time VARCHAR NOT NULL,
  measurements JSONB NOT NULL,
  cabinet_uid UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  FOREIGN KEY (cabinet_uid) REFERENCES cabinet(cabinet_uid) ON DELETE CASCADE ON UPDATE CASCADE
);