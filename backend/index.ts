import express, { Request, Response } from "express";

const app = express();
const port = process.env.PORT || 3000;

app.get('/', (req: Request, res: Response) => {
    res.send('<h1>Main page</h1>');
});

app.listen(port, () => console.log('Server has been started'));