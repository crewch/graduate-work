import { SubmissionResult } from '@prisma/client';

export type TestResult = Omit<SubmissionResult, 'submissionId'>;
