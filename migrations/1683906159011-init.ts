import { MigrationInterface, QueryRunner } from 'typeorm';

export class init1683906159011 implements MigrationInterface {
  name = 'init1683906159011';
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "owner" ("owner_uid" uuid NOT NULL, "first_name" varchar NOT NULL, "last_name" varchar NOT NULL, "ownername" varchar NOT NULL, "email" varchar NOT NULL, "phone_number" varchar NOT NULL, "city" varchar NOT NULL, "description" varchar NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_e599b90870d9d3155e641063ca5" PRIMARY KEY ("owner_uid"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "cabinet" ("cabinet_uid" uuid NOT NULL, "brand_name" varchar NOT NULL, "product_name" varchar NOT NULL, "enclosure_type" varchar NOT NULL, "weight" float NOT NULL, "dimension" varchar NOT NULL, "manufacturing_year" integer NOT NULL, "description" varchar NOT NULL, "owner_uid" uuid NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_4b8cadc8a1d7af2b417fd5ca59f" PRIMARY KEY ("cabinet_uid"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "cabinet" ADD CONSTRAINT "FK_296304c6522d65c506b46fbfe4a" FOREIGN KEY ("owner_uid") REFERENCES "owner"("owner_uid") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `CREATE TABLE "driver" ("driver_uid" uuid NOT NULL, "brand_name" varchar NOT NULL, "product_name" varchar NOT NULL, "driver_type" varchar NOT NULL, "manufacturing_year" integer NOT NULL, "nominal_diameter" float NOT NULL, "nominal_impedance" float NOT NULL, "continuous_power_handling" float NOT NULL, "cabinet_uid" uuid NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_2f25fae55a3bd80337501b310e3" PRIMARY KEY ("driver_uid"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "driver" ADD CONSTRAINT "FK_32bcbf28fad994478cc02ccbefa" FOREIGN KEY ("cabinet_uid") REFERENCES "cabinet"("cabinet_uid") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `CREATE TABLE "frequency" ("frequency_uid" uuid NOT NULL, "measured_by" varchar NOT NULL, "source" varchar NOT NULL, "sweep_length" varchar NOT NULL, "measured_at" varchar, "frequency_weightings" varchar NOT NULL, "target_level" varchar NOT NULL, "note" varchar NOT NULL, "smoothing" varchar NOT NULL, "frequencies" jsonb NOT NULL, "spls" jsonb NOT NULL, "phases" jsonb NOT NULL, "cabinet_uid" uuid NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_df955cae05f17b2bcf5045cc021" PRIMARY KEY ("frequency_uid"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "frequency" ADD CONSTRAINT "FK_296304c6522d65cca4ee43671db" FOREIGN KEY ("cabinet_uid") REFERENCES "cabinet"("cabinet_uid") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `CREATE TABLE "impedance" ("impedance_uid" uuid NOT NULL, "source" varchar NOT NULL, "piston_diameter" varchar NOT NULL, "resonance_frequency" varchar NOT NULL, "dc_resistance" varchar NOT NULL, "ac_resistance" varchar NOT NULL, "mechanical_damping" varchar NOT NULL, "electrical_damping" varchar NOT NULL, "total_damping" varchar NOT NULL, "equivalence_compliance" varchar NOT NULL, "voice_coil_inductance" varchar NOT NULL, "efficiency" varchar NOT NULL, "sensitivity" varchar NOT NULL, "cone_mass" varchar NOT NULL, "suspension_compliance" varchar NOT NULL, "force_factor" varchar NOT NULL, "kr" varchar NOT NULL, "xr" varchar NOT NULL, "ki" varchar NOT NULL, "xi" varchar NOT NULL, "cabinet_uid" uuid NOT NULL, "frequencies" jsonb NOT NULL, "impedances" jsonb NOT NULL, "phases" jsonb NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_197314cb3b86f25abee280469ff" PRIMARY KEY ("impedance_uid"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "impedance" ADD CONSTRAINT "FK_296304c6522d65cca4ee43673dc" FOREIGN KEY ("cabinet_uid") REFERENCES "cabinet"("cabinet_uid") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `CREATE TABLE "impulse" ("impulse_uid" uuid NOT NULL, "measured_by" varchar NOT NULL, "source" varchar NOT NULL, "measured_at" varchar NOT NULL, "sweep_length" varchar NOT NULL, "response_window" varchar NOT NULL, "note" varchar NOT NULL, "peak_value_before_initialization" varchar NOT NULL, "peak_index" varchar NOT NULL, "response_length" varchar NOT NULL, "sample_interval" varchar NOT NULL, "start_time" varchar NOT NULL,  "measurements" jsonb NOT NULL, "cabinet_uid" uuid NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_defcb32ebd8a501832969358f0f" PRIMARY KEY ("impulse_uid"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "impulse" ADD CONSTRAINT "FK_df955cae05f17b2bcf5045cc022" FOREIGN KEY ("cabinet_uid") REFERENCES "cabinet"("cabinet_uid") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "cabinet" DROP CONSTRAINT "FK_296304c6522d65c506b46fbfe4a"`);
    await queryRunner.query(`ALTER TABLE "driver" DROP CONSTRAINT "FK_32bcbf28fad994478cc02ccbefa"`);
    await queryRunner.query(`ALTER TABLE "frequency" DROP CONSTRAINT "FK_296304c6522d65cca4ee43671db"`);
    await queryRunner.query(`ALTER TABLE "impedance" DROP CONSTRAINT "FK_296304c6522d65cca4ee43673dc"`);
    await queryRunner.query(`ALTER TABLE "impulse" DROP CONSTRAINT "FK_df955cae05f17b2bcf5045cc022"`);
    await queryRunner.query(`DROP TABLE "owner"`);
    await queryRunner.query(`DROP TABLE "cabinet"`);
    await queryRunner.query(`DROP TABLE "driver"`);
    await queryRunner.query(`DROP TABLE "impedance"`);
    await queryRunner.query(`DROP TABLE "frequency"`);
    await queryRunner.query(`DROP TABLE "impulse"`);
  }
}
