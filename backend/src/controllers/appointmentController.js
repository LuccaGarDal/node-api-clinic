import {prisma} from '../config/db.js';

const createAppointment = async (req, res) => {
    const {endereco, notas, userId, inicio} = req.body;

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
            userId,
            inicio: dataInicio,
            fim: dataFim,
            endereco,
            notas
        }
    });

    res.status(201).json(appointment);
}

export {createAppointment };