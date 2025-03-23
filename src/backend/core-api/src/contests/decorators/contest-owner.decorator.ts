import { UseGuards } from '@nestjs/common';
import { ContestOwnerGuard } from '../guards/contest-owner.guard';

export const ContestOwner = () => UseGuards(ContestOwnerGuard);
