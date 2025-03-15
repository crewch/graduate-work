/*
  Warnings:

  - You are about to drop the `Contest` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ContestProblem` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ContestStanding` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Problem` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ProblemSample` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Submission` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SubmissionResult` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TestCase` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Contest" DROP CONSTRAINT "Contest_created_by_fkey";

-- DropForeignKey
ALTER TABLE "ContestProblem" DROP CONSTRAINT "ContestProblem_contest_id_fkey";

-- DropForeignKey
ALTER TABLE "ContestProblem" DROP CONSTRAINT "ContestProblem_problem_id_fkey";

-- DropForeignKey
ALTER TABLE "ContestStanding" DROP CONSTRAINT "ContestStanding_contest_id_fkey";

-- DropForeignKey
ALTER TABLE "ContestStanding" DROP CONSTRAINT "ContestStanding_user_id_fkey";

-- DropForeignKey
ALTER TABLE "Problem" DROP CONSTRAINT "Problem_created_by_fkey";

-- DropForeignKey
ALTER TABLE "ProblemSample" DROP CONSTRAINT "ProblemSample_problem_id_fkey";

-- DropForeignKey
ALTER TABLE "Submission" DROP CONSTRAINT "Submission_contest_id_fkey";

-- DropForeignKey
ALTER TABLE "Submission" DROP CONSTRAINT "Submission_problem_id_fkey";

-- DropForeignKey
ALTER TABLE "Submission" DROP CONSTRAINT "Submission_user_id_fkey";

-- DropForeignKey
ALTER TABLE "SubmissionResult" DROP CONSTRAINT "SubmissionResult_submission_id_fkey";

-- DropForeignKey
ALTER TABLE "SubmissionResult" DROP CONSTRAINT "SubmissionResult_test_id_fkey";

-- DropForeignKey
ALTER TABLE "TestCase" DROP CONSTRAINT "TestCase_problem_id_fkey";

-- DropTable
DROP TABLE "Contest";

-- DropTable
DROP TABLE "ContestProblem";

-- DropTable
DROP TABLE "ContestStanding";

-- DropTable
DROP TABLE "Problem";

-- DropTable
DROP TABLE "ProblemSample";

-- DropTable
DROP TABLE "Submission";

-- DropTable
DROP TABLE "SubmissionResult";

-- DropTable
DROP TABLE "TestCase";

-- DropTable
DROP TABLE "User";

-- CreateTable
CREATE TABLE "contests" (
    "contest_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "start_time" TIMESTAMP(3) NOT NULL,
    "end_time" TIMESTAMP(3) NOT NULL,
    "status" "ContestStatus" NOT NULL,
    "created_by" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "contests_pkey" PRIMARY KEY ("contest_id")
);

-- CreateTable
CREATE TABLE "contest_problems" (
    "contest_id" TEXT NOT NULL,
    "problem_id" TEXT NOT NULL,
    "problem_index" TEXT NOT NULL,

    CONSTRAINT "contest_problems_pkey" PRIMARY KEY ("contest_id","problem_id")
);

-- CreateTable
CREATE TABLE "contest_standings" (
    "contest_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "rank" INTEGER NOT NULL,
    "problems_solved" INTEGER NOT NULL,
    "penalty" INTEGER NOT NULL,

    CONSTRAINT "contest_standings_pkey" PRIMARY KEY ("contest_id","user_id")
);

-- CreateTable
CREATE TABLE "problems" (
    "problem_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "input_format" TEXT NOT NULL,
    "output_format" TEXT NOT NULL,
    "time_limit" INTEGER NOT NULL,
    "memory_limit" INTEGER NOT NULL,
    "created_by" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "problems_pkey" PRIMARY KEY ("problem_id")
);

-- CreateTable
CREATE TABLE "problem_samples" (
    "sample_id" TEXT NOT NULL,
    "problem_id" TEXT NOT NULL,
    "input_sample" TEXT NOT NULL,
    "output_sample" TEXT NOT NULL,
    "explanation" TEXT,

    CONSTRAINT "problem_samples_pkey" PRIMARY KEY ("sample_id")
);

-- CreateTable
CREATE TABLE "submissions" (
    "submission_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "contest_id" TEXT NOT NULL,
    "problem_id" TEXT NOT NULL,
    "language" "ProgrammingLanguage" NOT NULL,
    "code" TEXT NOT NULL,
    "submission_time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "verdict" "SubmissionStatus" NOT NULL,
    "execution_time" INTEGER,
    "memory_used" INTEGER,

    CONSTRAINT "submissions_pkey" PRIMARY KEY ("submission_id")
);

-- CreateTable
CREATE TABLE "submission_results" (
    "submission_id" TEXT NOT NULL,
    "test_id" TEXT NOT NULL,
    "status" "SubmissionStatus" NOT NULL,
    "error_message" TEXT,
    "execution_time" INTEGER,
    "memory_used" INTEGER,

    CONSTRAINT "submission_results_pkey" PRIMARY KEY ("submission_id","test_id")
);

-- CreateTable
CREATE TABLE "test_cases" (
    "test_id" TEXT NOT NULL,
    "problem_id" TEXT NOT NULL,
    "input_data" TEXT NOT NULL,
    "expected_output" TEXT NOT NULL,

    CONSTRAINT "test_cases_pkey" PRIMARY KEY ("test_id")
);

-- CreateTable
CREATE TABLE "users" (
    "user_id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "rating" INTEGER NOT NULL DEFAULT 1500,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("user_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- AddForeignKey
ALTER TABLE "contests" ADD CONSTRAINT "contests_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contest_problems" ADD CONSTRAINT "contest_problems_contest_id_fkey" FOREIGN KEY ("contest_id") REFERENCES "contests"("contest_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contest_problems" ADD CONSTRAINT "contest_problems_problem_id_fkey" FOREIGN KEY ("problem_id") REFERENCES "problems"("problem_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contest_standings" ADD CONSTRAINT "contest_standings_contest_id_fkey" FOREIGN KEY ("contest_id") REFERENCES "contests"("contest_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contest_standings" ADD CONSTRAINT "contest_standings_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "problems" ADD CONSTRAINT "problems_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "problem_samples" ADD CONSTRAINT "problem_samples_problem_id_fkey" FOREIGN KEY ("problem_id") REFERENCES "problems"("problem_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "submissions" ADD CONSTRAINT "submissions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "submissions" ADD CONSTRAINT "submissions_contest_id_fkey" FOREIGN KEY ("contest_id") REFERENCES "contests"("contest_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "submissions" ADD CONSTRAINT "submissions_problem_id_fkey" FOREIGN KEY ("problem_id") REFERENCES "problems"("problem_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "submission_results" ADD CONSTRAINT "submission_results_submission_id_fkey" FOREIGN KEY ("submission_id") REFERENCES "submissions"("submission_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "submission_results" ADD CONSTRAINT "submission_results_test_id_fkey" FOREIGN KEY ("test_id") REFERENCES "test_cases"("test_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "test_cases" ADD CONSTRAINT "test_cases_problem_id_fkey" FOREIGN KEY ("problem_id") REFERENCES "problems"("problem_id") ON DELETE RESTRICT ON UPDATE CASCADE;
