import express from "express";
import {createAppointment, deleteAppointment, updateAppointment, getAppointments, getAllAppointments} from "../controllers/appointmentController.js";
import { authMiddleware, authorizeRole } from "../middlewares/authMiddlewares.js";
import { validateRequest } from "../middlewares/validateRequest.js";
import { addAppointmentSchema, updateAppointmentSchema } from "../validators/appointmentValidators.js";

const router = express.Router();

router.use(authMiddleware); // Apply authentication middleware to all routes in this router

router.post("/appointments",validateRequest(addAppointmentSchema), createAppointment);

router.delete("/appointments/:id", deleteAppointment);

router.put("/appointments/:id",validateRequest(updateAppointmentSchema), updateAppointment);

router.get("/myAppointments", getAppointments);

router.get("/appointments",authorizeRole("SECRETARIO"), getAllAppointments);

export default router;