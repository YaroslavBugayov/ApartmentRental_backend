import express, { Request, Response } from "express";
import authRouter from './routes/auth';
import dotenv from "dotenv";
import path from "path";

dotenv.config()

const app = express();
const port = process.env.PORT || 3000;

app.set('view engine', 'ejs');
// dotenv.config( { path: path.resolve(__dirname, "../.env") } );


app.use(express.json());

app.use('/auth', authRouter);

app.listen(port, () => console.log(`Server has been started on port ${port}`));