import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1753071319408 implements MigrationInterface {
    name = 'Migrations1753071319408'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "addresses" DROP CONSTRAINT "FK_a3aa8eb2226a91851aec4a56ff7"`);
        await queryRunner.query(`ALTER TABLE "addresses" ALTER COLUMN "contact_id" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "addresses" ADD CONSTRAINT "FK_a3aa8eb2226a91851aec4a56ff7" FOREIGN KEY ("contact_id") REFERENCES "contacts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "addresses" DROP CONSTRAINT "FK_a3aa8eb2226a91851aec4a56ff7"`);
        await queryRunner.query(`ALTER TABLE "addresses" ALTER COLUMN "contact_id" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "addresses" ADD CONSTRAINT "FK_a3aa8eb2226a91851aec4a56ff7" FOREIGN KEY ("contact_id") REFERENCES "contacts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
