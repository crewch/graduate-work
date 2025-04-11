import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JudgeModule } from './judge/judge.module';

@Module({
  imports: [ConfigModule.forRoot(), JudgeModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
