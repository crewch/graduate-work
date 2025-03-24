import { UseGuards } from '@nestjs/common';
import { ProblemOwnerGuard } from '../guards/problem-owner.guard';

export const ProblemOwner = () => UseGuards(ProblemOwnerGuard);
