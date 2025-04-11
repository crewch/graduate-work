/*
  Warnings:

  - The values [CPP] on the enum `ProgrammingLanguage` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ProgrammingLanguage_new" AS ENUM ('PYTHON', 'JAVASCRIPT');
ALTER TABLE "submissions" ALTER COLUMN "language" TYPE "ProgrammingLanguage_new" USING ("language"::text::"ProgrammingLanguage_new");
ALTER TYPE "ProgrammingLanguage" RENAME TO "ProgrammingLanguage_old";
ALTER TYPE "ProgrammingLanguage_new" RENAME TO "ProgrammingLanguage";
DROP TYPE "ProgrammingLanguage_old";
COMMIT;
