/*
  Warnings:

  - You are about to drop the column `input_sample` on the `problem_samples` table. All the data in the column will be lost.
  - You are about to drop the column `output_sample` on the `problem_samples` table. All the data in the column will be lost.
  - You are about to drop the column `expected_output` on the `test_cases` table. All the data in the column will be lost.
  - You are about to drop the column `input_data` on the `test_cases` table. All the data in the column will be lost.
  - Added the required column `input` to the `problem_samples` table without a default value. This is not possible if the table is not empty.
  - Added the required column `output` to the `problem_samples` table without a default value. This is not possible if the table is not empty.
  - Added the required column `input` to the `test_cases` table without a default value. This is not possible if the table is not empty.
  - Added the required column `output` to the `test_cases` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "problem_samples" DROP COLUMN "input_sample",
DROP COLUMN "output_sample",
ADD COLUMN     "input" TEXT NOT NULL,
ADD COLUMN     "output" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "test_cases" DROP COLUMN "expected_output",
DROP COLUMN "input_data",
ADD COLUMN     "input" TEXT NOT NULL,
ADD COLUMN     "output" TEXT NOT NULL;
