import * as express from 'express';
import * as path from 'path';
import * as http from 'http';
import * as dotenv from 'dotenv';
import * as mongoose from 'mongoose';

dotenv.config();

import BookReview from './lib/model';
import { IBookReview } from './lib/model'

const PORT: string | number = process.env.port || 8080;

let url: string | undefined = process.env.MONGO_URI;

mongoose.connect(<string>url, {
    useMongoClient: true
}, (err: mongoose.Error) => {
    if (err) {
        console.log(err.message);
        console.log(err);
    } else {
        console.log('Connected to MongoDb')
    }
});

(<any>mongoose).Promise = global.Promise;

class App {
    public express: express.Application;

    constructor() {
        this.express = express();
        this.mountRoutes();
    }

    BookReviewRouter() {
        const BookReviewRouter = express.Router()

        BookReviewRouter.get('/search/:query', (req: express.Request, res: express.Response) => {
            const query = req.params.query;

            if (!query) {
                return res.status(400).send({
                    data: 'Please specify a title'
                });
            }

            BookReview.find({ title: new RegExp(query, 'i') })
                .limit(10)
                .select('title author rating bookID -_id')
                .exec((err: Error, books: Array<IBookReview>) => {
                    if (err)
                        return res.status(500).send({
                            data: 'Sorry, Error'
                        });
                    return res.status(200).send({
                        data: books
                    });
                });
        });

        BookReviewRouter.get('/book/book_name', (req: express.Request, res: express.Response) => {
            const bookName = req.params.book_name;

            if (!bookName) {
                return res.status(400).send({
                    data: 'Please specify a title'
                });
            }

            BookReview.findOne({ title: new RegExp(bookName, 'i') })
                .exec((err: Error, book: IBookReview) => {
                    if (err)
                        return res.status(500).send({
                            data: 'Something went wrong'
                        });
                    return res.status(200).send({
                        data: book
                    });
                }) 
        });

        return BookReviewRouter;
    }

    private mountRoutes(): void {
        const router: express.Router = express.Router();
        this.express.use(express.static('.'));
        router.get('/', (_, res: express.Response) => {
            return res.sendFile(path.join( __dirname, 'index.html'));
        });
        this.express.use('/', router);
        this.express.use('/api', this.BookReviewRouter());
    }
}

const app: express.Application = new App().express;
const server: http.Server = http.createServer(app);

(<any>BookReview).createMapping((err: Error, mapping: any) => {
    if (err) {
        console.log("Error creating mapping");
        console.log(err);
    } else {
        console.log("Mapping created");
        console.log(mapping);
    }
});

const stream = (<any>BookReview).synchronize();
let count = 0;

stream.on('data', () => {
    console.log("Indexing Document: ", count++);
});

stream.on('close', () => {
    console.log('Indexed ' + count + ' documents');
});

stream.on('error', (err: Error) => {
    console.log(err);
});

server.listen(PORT, (err: Error): void | never => {
    if (err) {
        throw err;
    }
    // tslint:disable-next-line
    return console.log('Server listening on PORT: ' + PORT);
});
