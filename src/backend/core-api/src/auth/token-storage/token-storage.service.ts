import { InjectRedis } from '@nestjs-modules/ioredis';
import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class TokenStorageService {
  constructor(@InjectRedis() private readonly redisService: Redis) {}

  async saveToken(token: string, userId: string, ttl: number) {
    await this.redisService.set(`token:${token}`, userId, 'EX', ttl);
  }

  async getToken(token: string) {
    return this.redisService.get(`token:${token}`);
  }

  async deleteToken(token: string) {
    await this.redisService.del(`token:${token}`);
  }
}
