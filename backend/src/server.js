import express from 'express';
import {config} from 'dotenv';  
import { connectDB, disconnectDB } from './config/db.js';  
import  auhtRoutes from './routes/authRoutes.js';

config();
connectDB();

const app = express();

//BODY PARSING MIDDLEWARE
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//API ROUTES
app.use('/auth', auhtRoutes);

app.get('/api', (req, res) => {
  res.json({ message: 'Hello from the backend!' });
}); 

const server = app.listen(5000, () => {
  console.log('Server is running on port 5000');
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
