-- DropForeignKey
ALTER TABLE "contest_problems" DROP CONSTRAINT "contest_problems_contest_id_fkey";

-- DropForeignKey
ALTER TABLE "contest_problems" DROP CONSTRAINT "contest_problems_problem_id_fkey";

-- DropForeignKey
ALTER TABLE "contest_standings" DROP CONSTRAINT "contest_standings_contest_id_fkey";

-- DropForeignKey
ALTER TABLE "contest_standings" DROP CONSTRAINT "contest_standings_user_id_fkey";

-- DropForeignKey
ALTER TABLE "contests" DROP CONSTRAINT "contests_created_by_fkey";

-- DropForeignKey
ALTER TABLE "problem_samples" DROP CONSTRAINT "problem_samples_problem_id_fkey";

-- DropForeignKey
ALTER TABLE "problems" DROP CONSTRAINT "problems_created_by_fkey";

-- DropForeignKey
ALTER TABLE "submission_results" DROP CONSTRAINT "submission_results_submission_id_fkey";

-- DropForeignKey
ALTER TABLE "submission_results" DROP CONSTRAINT "submission_results_test_id_fkey";

-- DropForeignKey
ALTER TABLE "submissions" DROP CONSTRAINT "submissions_contest_id_fkey";

-- DropForeignKey
ALTER TABLE "submissions" DROP CONSTRAINT "submissions_problem_id_fkey";

-- DropForeignKey
ALTER TABLE "submissions" DROP CONSTRAINT "submissions_user_id_fkey";

-- DropForeignKey
ALTER TABLE "test_cases" DROP CONSTRAINT "test_cases_problem_id_fkey";

-- AlterTable
ALTER TABLE "contests" ALTER COLUMN "created_by" DROP NOT NULL;

-- AlterTable
ALTER TABLE "problems" ALTER COLUMN "created_by" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "contests" ADD CONSTRAINT "contests_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("user_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contest_problems" ADD CONSTRAINT "contest_problems_contest_id_fkey" FOREIGN KEY ("contest_id") REFERENCES "contests"("contest_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contest_problems" ADD CONSTRAINT "contest_problems_problem_id_fkey" FOREIGN KEY ("problem_id") REFERENCES "problems"("problem_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contest_standings" ADD CONSTRAINT "contest_standings_contest_id_fkey" FOREIGN KEY ("contest_id") REFERENCES "contests"("contest_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contest_standings" ADD CONSTRAINT "contest_standings_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "problems" ADD CONSTRAINT "problems_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("user_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "problem_samples" ADD CONSTRAINT "problem_samples_problem_id_fkey" FOREIGN KEY ("problem_id") REFERENCES "problems"("problem_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "submissions" ADD CONSTRAINT "submissions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "submissions" ADD CONSTRAINT "submissions_contest_id_fkey" FOREIGN KEY ("contest_id") REFERENCES "contests"("contest_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "submissions" ADD CONSTRAINT "submissions_problem_id_fkey" FOREIGN KEY ("problem_id") REFERENCES "problems"("problem_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "submission_results" ADD CONSTRAINT "submission_results_submission_id_fkey" FOREIGN KEY ("submission_id") REFERENCES "submissions"("submission_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "submission_results" ADD CONSTRAINT "submission_results_test_id_fkey" FOREIGN KEY ("test_id") REFERENCES "test_cases"("test_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "test_cases" ADD CONSTRAINT "test_cases_problem_id_fkey" FOREIGN KEY ("problem_id") REFERENCES "problems"("problem_id") ON DELETE CASCADE ON UPDATE CASCADE;
