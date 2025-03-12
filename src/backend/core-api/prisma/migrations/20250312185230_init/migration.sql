-- CreateEnum
CREATE TYPE "ContestStatus" AS ENUM ('UPCOMING', 'ONGOING', 'FINISHED');

-- CreateEnum
CREATE TYPE "ProgrammingLanguage" AS ENUM ('CPP', 'PYTHON', 'JAVASCRIPT');

-- CreateEnum
CREATE TYPE "SubmissionStatus" AS ENUM ('ACCEPTED', 'WRONG_ANSWER', 'TIME_LIMIT_EXCEEDED', 'MEMORY_LIMIT_EXCEEDED', 'RUNTIME_ERROR', 'COMPILATION_ERROR', 'FAILED');

-- CreateTable
CREATE TABLE "Contest" (
    "contest_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "start_time" TIMESTAMP(3) NOT NULL,
    "end_time" TIMESTAMP(3) NOT NULL,
    "status" "ContestStatus" NOT NULL,
    "created_by" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Contest_pkey" PRIMARY KEY ("contest_id")
);

-- CreateTable
CREATE TABLE "ContestProblem" (
    "contest_id" TEXT NOT NULL,
    "problem_id" TEXT NOT NULL,
    "problem_index" TEXT NOT NULL,

    CONSTRAINT "ContestProblem_pkey" PRIMARY KEY ("contest_id","problem_id")
);

-- CreateTable
CREATE TABLE "ContestStanding" (
    "contest_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "rank" INTEGER NOT NULL,
    "problems_solved" INTEGER NOT NULL,
    "penalty" INTEGER NOT NULL,

    CONSTRAINT "ContestStanding_pkey" PRIMARY KEY ("contest_id","user_id")
);

-- CreateTable
CREATE TABLE "Problem" (
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

    CONSTRAINT "Problem_pkey" PRIMARY KEY ("problem_id")
);

-- CreateTable
CREATE TABLE "ProblemSample" (
    "sample_id" TEXT NOT NULL,
    "problem_id" TEXT NOT NULL,
    "input_sample" TEXT NOT NULL,
    "output_sample" TEXT NOT NULL,
    "explanation" TEXT,

    CONSTRAINT "ProblemSample_pkey" PRIMARY KEY ("sample_id")
);

-- CreateTable
CREATE TABLE "Submission" (
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

    CONSTRAINT "Submission_pkey" PRIMARY KEY ("submission_id")
);

-- CreateTable
CREATE TABLE "SubmissionResult" (
    "submission_id" TEXT NOT NULL,
    "test_id" TEXT NOT NULL,
    "status" "SubmissionStatus" NOT NULL,
    "error_message" TEXT,
    "execution_time" INTEGER,
    "memory_used" INTEGER,

    CONSTRAINT "SubmissionResult_pkey" PRIMARY KEY ("submission_id","test_id")
);

-- CreateTable
CREATE TABLE "TestCase" (
    "test_id" TEXT NOT NULL,
    "problem_id" TEXT NOT NULL,
    "input_data" TEXT NOT NULL,
    "expected_output" TEXT NOT NULL,

    CONSTRAINT "TestCase_pkey" PRIMARY KEY ("test_id")
);

-- CreateTable
CREATE TABLE "User" (
    "user_id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "rating" INTEGER NOT NULL DEFAULT 1500,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("user_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "Contest" ADD CONSTRAINT "Contest_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContestProblem" ADD CONSTRAINT "ContestProblem_contest_id_fkey" FOREIGN KEY ("contest_id") REFERENCES "Contest"("contest_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContestProblem" ADD CONSTRAINT "ContestProblem_problem_id_fkey" FOREIGN KEY ("problem_id") REFERENCES "Problem"("problem_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContestStanding" ADD CONSTRAINT "ContestStanding_contest_id_fkey" FOREIGN KEY ("contest_id") REFERENCES "Contest"("contest_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContestStanding" ADD CONSTRAINT "ContestStanding_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Problem" ADD CONSTRAINT "Problem_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProblemSample" ADD CONSTRAINT "ProblemSample_problem_id_fkey" FOREIGN KEY ("problem_id") REFERENCES "Problem"("problem_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Submission" ADD CONSTRAINT "Submission_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Submission" ADD CONSTRAINT "Submission_contest_id_fkey" FOREIGN KEY ("contest_id") REFERENCES "Contest"("contest_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Submission" ADD CONSTRAINT "Submission_problem_id_fkey" FOREIGN KEY ("problem_id") REFERENCES "Problem"("problem_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubmissionResult" ADD CONSTRAINT "SubmissionResult_submission_id_fkey" FOREIGN KEY ("submission_id") REFERENCES "Submission"("submission_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubmissionResult" ADD CONSTRAINT "SubmissionResult_test_id_fkey" FOREIGN KEY ("test_id") REFERENCES "TestCase"("test_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TestCase" ADD CONSTRAINT "TestCase_problem_id_fkey" FOREIGN KEY ("problem_id") REFERENCES "Problem"("problem_id") ON DELETE RESTRICT ON UPDATE CASCADE;
