import { InjectRedis } from '@nestjs-modules/ioredis';
import { Injectable } from '@nestjs/common';
import { Redis } from 'ioredis';

export declare interface ISetText {
  key: string;
  value: number | string;
  time?: number;
}

@Injectable()
export class RedisCacheService {
  constructor(@InjectRedis() private client: Redis) {}

  async get(key: string): Promise<string | null> {
    return this.client.get(key);
  }

  async set(key: string, value: string, ttl?: number): Promise<void> {
    ttl ? await this.client.set(key, value, 'EX', ttl) : await this.client.set(key, value);
  }

  async incr(key: string): Promise<number> {
    return this.client.incr(key);
  }

  async expire(key: string, ttl: number): Promise<void> {
    await this.client.expire(key, ttl);
  }

  async setByText(payload: ISetText): Promise<void> {
    payload.time
      ? await this.client.set(payload.key, payload.value, 'EX', payload.time)
      : await this.client.set(payload.key, payload.value);
  }

  async getByText(key: string): Promise<string | null> {
    return this.get(key);
  }

  async delete(key: string): Promise<void> {
    await this.client.del(key);
  }

  async mset(data: Record<string, string>, ttl?: number): Promise<void> {
    const pipeline = this.client.pipeline();
    Object.entries(data).forEach(([key, value]) => {
      if (ttl) {
        pipeline.set(key, value, 'EX', ttl);
      } else {
        pipeline.set(key, value);
      }
    });
    await pipeline.exec();
  }

  async getAllKeys(pattern: string): Promise<string[]> {
    return new Promise((resolve, reject) => {
      const stream = this.client.scanStream({ match: pattern });
      const keys: string[] = [];

      stream.on('data', (resultKeys) => {
        keys.push(...resultKeys);
      });

      stream.on('end', () => resolve(keys));
      stream.on('error', (err) => reject(err));
    });
  }
}
