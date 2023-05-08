import express, { Request, Response } from "express";

const app = express();
const port = process.env.PORT || 3000;
import authRouter from './routes/auth';

app.set('view engine', 'ejs');

app.use(express.json());

app.use('/auth', authRouter);

app.listen(port, () => console.log(`Server has been started on port ${port}`));