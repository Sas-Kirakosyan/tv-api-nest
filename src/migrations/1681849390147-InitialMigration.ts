import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialMigration1681849390147 implements MigrationInterface {
  name = "InitialMigration1681849390147";

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Write your "up" SQL changes here
    await queryRunner.query(`
      CREATE TABLE "user" (
        "id" SERIAL NOT NULL, 
        "email" VARCHAR NOT NULL, 
        "password" VARCHAR NOT NULL, 
        "phone" VARCHAR, 
        "firstname" VARCHAR, 
        CONSTRAINT "UQ_email" UNIQUE ("email"), 
        PRIMARY KEY ("id")
      );
    `);

    await queryRunner.query(`
      CREATE TABLE "user_subscription" (
        "id" SERIAL NOT NULL, 
        "subscriptionId" VARCHAR NOT NULL, 
        "package" VARCHAR NOT NULL, 
        "tvUsername" VARCHAR NOT NULL, 
        "tvPassword" VARCHAR NOT NULL, 
        "expireDate" TIMESTAMP NOT NULL, 
        "isActive" BOOLEAN DEFAULT false, 
        "createdAt" TIMESTAMP DEFAULT now(), 
        "updatedAt" TIMESTAMP DEFAULT now(), 
        "userId" INTEGER, 
        PRIMARY KEY ("id"),
        CONSTRAINT "FK_userId" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Write your "down" SQL changes here (reverse of "up")
    await queryRunner.query(`DROP TABLE "user_subscription";`);
    await queryRunner.query(`DROP TABLE "user";`);
  }
}
