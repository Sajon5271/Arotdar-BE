import express, { Express, Request, Response, Router } from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import 'dotenv/config';
import { router } from './routes/router';

const app = express();
app.use(cors({ origin: ['http://localhost:4200'], credentials: true }));
app.use(express.json());
app.use(router);

startServer();

async function startServer() {
  try {
    console.log(process.env.DATABASE_URL);
    await mongoose.connect(process.env.DATABASE_URL || '');
    app.listen(process.env.PORT || 3000, () => {
      console.log(`AppRunning in ${process.env.PORT || 3000}`);
    });
  } catch (error) {
    console.error('Something went wrong!');
    console.error(error);
  }
}
