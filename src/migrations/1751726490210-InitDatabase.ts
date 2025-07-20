import { MigrationInterface, QueryRunner } from "typeorm";

export class InitDatabase1751726490210 implements MigrationInterface {
    name = 'InitDatabase1751726490210'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "token" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "token" SET NOT NULL`);
    }

}
