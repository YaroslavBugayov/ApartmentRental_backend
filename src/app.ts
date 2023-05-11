import express from "express";
import userRouter from './routes/user.router';
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use('/swagger', swaggerUi.serve, swaggerUi.setup(undefined,
    { swaggerOptions: { url: './swagger.json' } }))
app.use(express.json());
app.use(cookieParser());
app.use(cors());

app.use('/api', userRouter);

app.listen(port, () => console.log(`Server has been started on port ${port}`));