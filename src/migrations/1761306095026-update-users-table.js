import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateUsersTable1761306095026 {
    name = 'UpdateUsersTable1761306095026'

    async up(queryRunner) {
        await queryRunner.query(`CREATE TABLE "projects" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP DEFAULT now(), "deleted_at" TIMESTAMP, "name" character varying NOT NULL, "description" character varying NOT NULL, "base_url" character varying NOT NULL, "prometheus_metric_url" character varying NOT NULL, "team_id" integer NOT NULL, CONSTRAINT "UQ_7e4c22d7e07f951b4dd0b7b4e12" UNIQUE ("base_url"), CONSTRAINT "UQ_b5afd516fdb8af5b4623b077113" UNIQUE ("prometheus_metric_url"), CONSTRAINT "PK_6271df0a7aed1d6c0691ce6ac50" PRIMARY KEY ("id"))`);
    }

    async down(queryRunner) {
        await queryRunner.query(`DROP TABLE "projects"`);
    }

}
