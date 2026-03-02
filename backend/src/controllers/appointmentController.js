import {prisma} from '../config/db.js';

const createAppointment = async (req, res) => {
    const {endereco, notas, inicio} = req.body;

    const dataInicio = new Date(inicio);
    const dataFim = new Date(dataInicio.getTime() + 30 * 60 * 1000); // Assuming appointments are 30 minutes long

    const appointmentExists = await prisma.appointment.findFirst({
        where: {
            AND: [
                { inicio: { lt: dataFim } },
                { fim: { gt: dataInicio } }
            ]
        }
    });

    if (appointmentExists) {
        return res.status(400).json({ error: "There is already an appointment for this date" });
    }

    const appointment = await prisma.appointment.create({
        data: {
            userId: req.user.id,
            inicio: dataInicio,
            fim: dataFim,
            endereco,
            notas
        }
    });

    res.status(201).json(appointment);
}

const deleteAppointment = async (req, res) => {
    const appointment = await prisma.appointment.findUnique({
        where: {
            id: req.params.id
        }
    });

    if (!appointment) {
        return res.status(404).json({ error: "Appointment not found" });
    }

    if (appointment.userId !== req.user.id) {
        return res.status(403).json({ error: "You are not authorized to delete this appointment" });
    }

    await prisma.appointment.delete({
        where: {
            id: req.params.id
        }
    });

    res.status(200).json({
        status:"success",
        message: "Appointment deleted successfully" 
    });
}

const updateAppointment = async (req, res) => {
    const {endereco, notas, inicio} = req.body;

    const appointment = await prisma.appointment.findUnique({
        where: {
            id: req.params.id
        }
    });

    if (!appointment) {
        return res.status(404).json({ error: "Appointment not found" });
    }

    if (appointment.userId !== req.user.id) {
        return res.status(403).json({ error: "You are not authorized to update this appointment" });
    }

    const updateData = {};

    if (endereco !== undefined) {
        updateData.endereco = endereco;
    }
    
    if (notas !== undefined) {
        updateData.notas = notas;
    }
    
    if (inicio !== undefined) {
        const dataInicio = new Date(inicio);
        const dataFim = new Date(dataInicio.getTime() + 30 * 60 * 1000); // Assuming appointments are 30 minutes long
        updateData.inicio = dataInicio;
        updateData.fim = dataFim;

        const appointmentExists = await prisma.appointment.findFirst({
            where: {
                AND: [
                    { inicio: { lt: dataFim } },
                    { fim: { gt: dataInicio } }
                ]
            }
        });

        if (appointmentExists) {
            return res.status(400).json({ error: "There is already an appointment for this date" });
        }
    }

    const updatedAppointment = await prisma.appointment.update({
        where: {
            id: req.params.id
        },
        data: updateData
    });

    res.status(200).json({
        status: "success",
        message: "Appointment updated successfully",
        data: updatedAppointment
    });
    
}

const getAppointments = async (req, res) => {
    const appointments = await prisma.appointment.findMany({
        where: {
            userId: req.user.id
        }
    });

    res.status(200).json({
        status: "success",
        data: appointments
    });
}

const getAllAppointments = async (req, res) => {

    const appointments = await prisma.appointment.findMany();

    res.status(200).json({
        status: "success",
        data: appointments
    });
}

export {createAppointment, deleteAppointment, updateAppointment, getAppointments, getAllAppointments};