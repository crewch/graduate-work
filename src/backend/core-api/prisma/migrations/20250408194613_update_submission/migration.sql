/*
  Warnings:

  - The values [RUNTIME_ERROR,COMPILATION_ERROR] on the enum `SubmissionStatus` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `execution_time` on the `submissions` table. All the data in the column will be lost.
  - You are about to drop the column `memory_used` on the `submissions` table. All the data in the column will be lost.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "SubmissionStatus_new" AS ENUM ('ACCEPTED', 'PENDING', 'FAILED', 'WRONG_ANSWER', 'TIME_LIMIT_EXCEEDED', 'MEMORY_LIMIT_EXCEEDED');
ALTER TABLE "submissions" ALTER COLUMN "verdict" TYPE "SubmissionStatus_new" USING ("verdict"::text::"SubmissionStatus_new");
ALTER TABLE "submission_results" ALTER COLUMN "status" TYPE "SubmissionStatus_new" USING ("status"::text::"SubmissionStatus_new");
ALTER TYPE "SubmissionStatus" RENAME TO "SubmissionStatus_old";
ALTER TYPE "SubmissionStatus_new" RENAME TO "SubmissionStatus";
DROP TYPE "SubmissionStatus_old";
COMMIT;

-- AlterTable
ALTER TABLE "submissions" DROP COLUMN "execution_time",
DROP COLUMN "memory_used";
