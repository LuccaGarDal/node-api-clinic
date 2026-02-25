import express from 'express';
import {config} from 'dotenv';  
import { connectDB, disconnectDB } from './config/db.js';  

config();
connectDB();

const app = express();

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
