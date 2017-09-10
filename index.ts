import * as express from 'express';
import * as path from 'path';
import * as http from 'http';
import * as dotenv from 'dotenv';

dotenv.config();

const PORT: string | number = process.env.port || 8080;

class App {
    public express: express.Application;

    constructor() {
        this.express = express();
        this.mountRoutes();
    }

    private mountRoutes(): void {
        const router: express.Router = express.Router();
        this.express.use(express.static('.'));
        router.get('/', (_, res: express.Response) => {
            return res.sendFile(path.join( __dirname, 'index.html'));
        });
        this.express.use('/', router);
    }
}

const app: express.Application = new App().express;
const server: http.Server = http.createServer(app);

server.listen(PORT, (err: Error): void | never => {
    if (err) {
        throw err;
    }
    // tslint:disable-next-line
    return console.log('Server listening on PORT: ' + PORT);
});
