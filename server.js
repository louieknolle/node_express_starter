import express from 'express';
import bodyParser from 'body-parser';
import allRoutes from './routes';
import cors from 'cors';
import { config } from 'dotenv';

// Loads environment vars from .env
config();

// Start the app and listen for requests on a port
const app = express();
const port = process.env.PORT || 5000;

if (process.env.NODE_ENV !== 'test') {
  app.listen(port, () => console.log(`Running on port ${port}`));
}

// Use cors library to prevent annoying cors issues
app.use(cors());

// This allows us to get req.body in JSON format - very important for post requests!
app.use(bodyParser.json());

// Load all our routes and start making requests!
app.use(allRoutes);

export { app };
