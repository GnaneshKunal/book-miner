import * as redis from 'redis';

const REDIS_PORT: any = process.env.REDIS_PORT || 6379;

class RedisClient {
    private client: redis.RedisClient;

    constructor() {
        this.client = redis.createClient(REDIS_PORT);
    }

    public setex(key: string, expiry: number, value: string): void {
        this.client.setex(key, expiry, value);
    }

    public get(key: string, callback: (err: Error, data: string) => void): void {
        this.client.get(key, callback);
    }

}

const redisClient = new RedisClient();
