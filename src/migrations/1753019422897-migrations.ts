import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1753019422897 implements MigrationInterface {
    name = 'Migrations1753019422897'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "addresses" ("id" SERIAL NOT NULL, "street" character varying(255) NOT NULL, "city" character varying(100) NOT NULL, "province" character varying(100) NOT NULL, "country" character varying(100) NOT NULL, "postal_code" character varying(10) NOT NULL, "contact_id" integer, CONSTRAINT "PK_745d8f43d3af10ab8247465e450" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "contacts" ("id" SERIAL NOT NULL, "first_name" character varying(100) NOT NULL, "last_name" character varying(100) NOT NULL, "email" character varying(100) NOT NULL, "phone" character varying(20) NOT NULL, "username" character varying(100) NOT NULL, CONSTRAINT "PK_b99cd40cfd66a99f1571f4f72e6" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "users" ("username" character varying(100) NOT NULL, "password" character varying(100) NOT NULL, "name" character varying(100) NOT NULL, "token" character varying(100), CONSTRAINT "PK_fe0bb3f6520ee0469504521e710" PRIMARY KEY ("username"))`);
        await queryRunner.query(`ALTER TABLE "addresses" ADD CONSTRAINT "FK_a3aa8eb2226a91851aec4a56ff7" FOREIGN KEY ("contact_id") REFERENCES "contacts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "contacts" ADD CONSTRAINT "FK_12817c294ff2261b1da63b561c8" FOREIGN KEY ("username") REFERENCES "users"("username") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "contacts" DROP CONSTRAINT "FK_12817c294ff2261b1da63b561c8"`);
        await queryRunner.query(`ALTER TABLE "addresses" DROP CONSTRAINT "FK_a3aa8eb2226a91851aec4a56ff7"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TABLE "contacts"`);
        await queryRunner.query(`DROP TABLE "addresses"`);
    }

}
