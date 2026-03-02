import express from "express";
import {createAppointment, deleteAppointment, updateAppointment} from "../controllers/appointmentController.js";
import { authMiddleware } from "../middlewares/authMiddlewares.js";

const router = express.Router();

router.use(authMiddleware); // Apply authentication middleware to all routes in this router

router.post("/appointments", createAppointment);

router.delete("/appointments/:id", deleteAppointment);

router.put("/appointments/:id", updateAppointment);

export default router;