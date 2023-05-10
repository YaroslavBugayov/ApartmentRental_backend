import express from "express";
import authRouter from './routes/user-router';
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from 'cors';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cookieParser());
app.use(cors());

app.use('/api', authRouter);

app.listen(port, () => console.log(`Server has been started on port ${port}`));