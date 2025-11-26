import { MigrationInterface, QueryRunner } from "typeorm";

export class InitSchema1764109195518 implements MigrationInterface {
    name = 'InitSchema1764109195518'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "hotel" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "city" character varying NOT NULL, "address" character varying, CONSTRAINT "PK_3a62ac86b369b36c1a297e9ab26" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "booking" ("id" SERIAL NOT NULL, "roomId" integer NOT NULL, "guestName" character varying NOT NULL, "checkIn" TIMESTAMP WITH TIME ZONE NOT NULL, "checkOut" TIMESTAMP WITH TIME ZONE NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "guestEmail" character varying, "guestsCount" integer, CONSTRAINT "PK_49171efc69702ed84c812f33540" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "room" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "capacity" integer, "roomType" character varying, "hotelId" integer NOT NULL, CONSTRAINT "PK_c6d46db005d623e691b2fbcba23" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "booking" ADD CONSTRAINT "FK_769a5e375729258fd0bbfc0a456" FOREIGN KEY ("roomId") REFERENCES "room"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "room" ADD CONSTRAINT "FK_2fac52abaa01b54156539cad11c" FOREIGN KEY ("hotelId") REFERENCES "hotel"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "room" DROP CONSTRAINT "FK_2fac52abaa01b54156539cad11c"`);
        await queryRunner.query(`ALTER TABLE "booking" DROP CONSTRAINT "FK_769a5e375729258fd0bbfc0a456"`);
        await queryRunner.query(`DROP TABLE "room"`);
        await queryRunner.query(`DROP TABLE "booking"`);
        await queryRunner.query(`DROP TABLE "hotel"`);
    }

}
