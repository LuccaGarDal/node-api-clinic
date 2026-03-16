import express from 'express';
import {config} from 'dotenv';  
import { connectDB, disconnectDB } from './config/db.js';  
import  auhtRoutes from './routes/authRoutes.js';
import appointmentRoutes from './routes/appointmentRoutes.js';
import cors from 'cors';
import cookieParser from 'cookie-parser';

config();
connectDB();

const app = express();

//BODY PARSING MIDDLEWARE
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser())

app.use(cors({
  origin: "http://localhost:5173", // endereço do Vue
  credentials: true
}));

//API ROUTES
app.use('/auth', auhtRoutes);
app.use('/api', appointmentRoutes);

app.get('/api', (req, res) => {
  res.json({ message: 'Hello from the backend!' });
}); 

const port = process.env.PORT || 5000;

const server = app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
}   );

process.on("unhandledRejection", (err) => {
  console.error("Unhandled Rejection:", err);
  server.close(async () => {  
    await disconnectDB();
    process.exit(1);
  });
});

process.on("uncaughtException", async (err) => {
   console.error("Uncaught Exception:", err);
   await disconnectDB();
   process.exit(1);
});  

process.on("SIGTERM", async () => {
  console.log("SIGTERM received, shutting down gracefully...");
  server.close(async () => {
    await disconnectDB();
    process.exit(0);
  } );
});
