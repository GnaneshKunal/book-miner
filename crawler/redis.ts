import * as express from 'express';
import * as superagent from 'superagent';
import * as redis from 'redis';
const PORT: number | string = process.env.PORT || 8080;
const REDIS_PORT: any = process.env.REDIS_PORT || 6379;

const app: express.Application = express();

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

function respond(org: string, numberOfRepos: string): string {
    return `Organization "${org} has ${numberOfRepos} public repositories.`;
}

function cache(req: express.Request, res: express.Response, next: express.NextFunction): void {
    const org: string = req.query.org;
    redisClient.get(org, (err: Error, data: string): never | void => {
        if (err) {
            throw err;
        }
        if (data != null) {
            res.send(respond(org, data));
        } else {
            next();
        }
    });
}

function getNumberOfRepos(req: express.Request, res: express.Response): void {
    const org: string = req.query.org;
    superagent.get(`https://api.github.com/orgs/${org}/repos`, (err: Error, response: superagent.Response) => {
        if (err) {
            throw err;
        }

        // response.body contains an array of public repositories
        const repoNumber = response.body.length;
        redisClient.setex(org, 5, repoNumber);
        res.send(respond(org, repoNumber));
    });
}

app.get('/', getNumberOfRepos);
app.listen(8080, (): void => { // tslint:disable-next-line
    console.log('App is listening on port', PORT);
});
