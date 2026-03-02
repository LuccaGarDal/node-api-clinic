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

export {createAppointment, deleteAppointment };