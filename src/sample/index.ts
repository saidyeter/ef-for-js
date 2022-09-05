import express, { Express, Request, Response } from 'express';
import bodyParser from 'body-parser'

import { router as bookRouter } from './routes/book'

const app: Express = express();
app.use(bodyParser.json())

const port = 8000;


export function startServer() {

    app.get('/', async (_req: Request, res: Response) => {
        res.send('Node.js + Express + TypeScript + ef4js Server');
    });

    app.use(bookRouter)

    app.listen(port, () => {
        console.log('server is listening now on localhost:' + port);
    })
}



// 533 698 0307
// resul

// 7 kw
// porselen klemens

// 252 612 2702 






