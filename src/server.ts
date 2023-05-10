import express, { Request, Response } from "express";
import authRouter from './routes/auth';
import dotenv from "dotenv";

dotenv.config()

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.use('/auth', authRouter);

app.listen(port, () => console.log(`Server has been started on port ${port}`));