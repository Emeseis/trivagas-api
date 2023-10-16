import 'dotenv/config';
import cors from 'cors';
import express from 'express';
import mongoose from 'mongoose';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import spaceRoutes from './routes/spaceRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';
import vehicleRoutes from './routes/VehicleRoutes.js';

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/', authRoutes);
app.use('/', userRoutes);
app.use('/', spaceRoutes);
app.use('/', bookingRoutes);
app.use('/', vehicleRoutes);

const DB_USER = process.env.DB_USER;
const DB_PASS = process.env.DB_PASS;
const port = 4000;

mongoose
  .set('strictQuery', false);

mongoose
  .connect(`mongodb+srv://${DB_USER}:${DB_PASS}@cluster-api.qt8ysip.mongodb.net/trivagas?retryWrites=true&w=majority`)
  .then(() => { app.listen(port); console.log(`Database successfully connected, running on port ${port}.`); })
  .catch(err => console.error(err));

export default app;
