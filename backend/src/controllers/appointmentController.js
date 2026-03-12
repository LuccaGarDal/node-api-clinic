import {prisma} from '../config/db.js';
import { getCepData } from '../service/cepService.js';
import { getRainForecast } from '../service/weatherService.js';

const createAppointment = async (req, res) => {
    const {notas, inicio, cep, numero, complemento} = req.body;

    const dataInicio = new Date(inicio);
    dataInicio.setMinutes(dataInicio.getMinutes() - dataInicio.getTimezoneOffset());
    const now = new Date()
    const dataFim = new Date(dataInicio.getTime() + 30 * 60 * 1000); // Assuming appointments are 30 minutes long

    if (dataInicio < now) {
        return res.status(400).json({
            status: "error",
            message: "Não é permitido agendar consultas no passado"
        })
    }

    const appointmentExists = await prisma.appointment.findFirst({
        where: {
            AND: [
                { inicio: { lt: dataFim } },
                { fim: { gt: dataInicio } }
            ]
        }
    });

    if (appointmentExists) {
        return res.status(400).json({ message: "There is already an appointment for this date" });
    }

    const cepData = await getCepData(cep);

    const address = await prisma.address.create({
        data: {
            cep: cep.replace(/\D/g, ""),
            logradouro: cepData.logradouro,
            bairro: cepData.bairro,
            cidade: cepData.localidade,
            estado: cepData.uf,
            numero,
            complemento
        }
    });

    const appointment = await prisma.appointment.create({
        data: {
            userId: req.user.id,
            inicio: dataInicio,
            fim: dataFim,
            addressId: address.id,
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

    await prisma.$transaction(async (tx) => {
        await tx.appointment.delete({
            where: { id: req.params.id }
        });

        await tx.address.delete({
            where: { id: appointment.addressId }
        });
    });

    res.status(200).json({
        status:"success",
        message: "Appointment deleted successfully" 
    });
}

const updateAppointment = async (req, res) => {
    const {notas, inicio, cep, numero, complemento} = req.body;

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

    if (cep || numero || complemento) {

        const addressUpdate = {};

        if (cep) {
            const cepData = await getCepData(cep);

            if (!cepData || cepData.erro) {
                return res.status(400).json({ error: "Invalid CEP" });
            }

            addressUpdate.cep = cep.replace(/\D/g, "");
            addressUpdate.logradouro = cepData.logradouro;
            addressUpdate.bairro = cepData.bairro;
            addressUpdate.cidade = cepData.localidade;
            addressUpdate.estado = cepData.uf;
        }

        if (numero !== undefined) {
            addressUpdate.numero = numero;
        }

        if (complemento !== undefined) {
            addressUpdate.complemento = complemento;
        }

        await prisma.address.update({
            where: { id: appointment.addressId },
            data: addressUpdate
        });
    }

    const updateData = {};
    
    if (notas !== undefined) {
        updateData.notas = notas;
    }
    
    if (inicio !== undefined) {
        const dataInicio = new Date(inicio);
        const dataFim = new Date(dataInicio.getTime() + 30 * 60 * 1000); // Assuming appointments are 30 minutes long

        const appointmentExists = await prisma.appointment.findFirst({
            where: {
                id: { not: req.params.id },
                AND: [
                    { inicio: { lt: dataFim } },
                    { fim: { gt: dataInicio } }
                ]
            }
        });

        if (appointmentExists) {
            return res.status(400).json({ error: "There is already an appointment for this date" });
        }

        updateData.inicio = dataInicio;
        updateData.fim = dataFim;
    }

    const updatedAppointment = await prisma.appointment.update({
        where: {
            id: req.params.id
        },
        data: updateData,
        include: {address: true}
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
        },
        include: { address: true },
        orderBy: {
            inicio: 'desc'
        }
    });

    const enrichedAppointments = await Promise.all(
        appointments.map(async (appointment) => {

            const city = appointment.address?.cidade;

            let weather = null;

            if (city) {
                weather = await getRainForecast(city, appointment.inicio);
            }

            return {
                ...appointment,
                weather
            };
        })
    );

    res.status(200).json({
        status: "success",
        data: enrichedAppointments
    });
}

const getAllAppointments = async (req, res) => {

    const appointments = await prisma.appointment.findMany({
        include: {
            address: true,
            user: true
        },
        orderBy: {
            inicio: 'desc'
        }
    });

    const enrichedAppointments = await Promise.all(
        appointments.map(async (appointment) => {

            const city = appointment.address?.cidade;

            let weather = null;

            if (city) {
                weather = await getRainForecast(city, appointment.inicio);
            }

            return {
                ...appointment,
                weather
            };
        })
    );

    res.status(200).json({
        status: "success",
        data: enrichedAppointments
    });
}

export {createAppointment, deleteAppointment, updateAppointment, getAppointments, getAllAppointments};