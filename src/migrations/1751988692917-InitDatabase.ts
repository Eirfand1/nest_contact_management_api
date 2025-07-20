import { MigrationInterface, QueryRunner } from "typeorm";

export class InitDatabase1751988692917 implements MigrationInterface {
    name = 'InitDatabase1751988692917'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "contacts" DROP CONSTRAINT "FK_12817c294ff2261b1da63b561c8"`);
        await queryRunner.query(`ALTER TABLE "contacts" ALTER COLUMN "username" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "contacts" ADD CONSTRAINT "FK_12817c294ff2261b1da63b561c8" FOREIGN KEY ("username") REFERENCES "users"("username") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "contacts" DROP CONSTRAINT "FK_12817c294ff2261b1da63b561c8"`);
        await queryRunner.query(`ALTER TABLE "contacts" ALTER COLUMN "username" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "contacts" ADD CONSTRAINT "FK_12817c294ff2261b1da63b561c8" FOREIGN KEY ("username") REFERENCES "users"("username") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
