import {prisma} from '../config/db.js';
import { getCepData } from '../service/cepService.js';
import { getRainForecast } from '../service/weatherService.js';
import { z } from 'zod';

const createAppointment = async (req, res) => {
    const {notas, inicio, cep, numero, complemento} = req.body;

    const dataInicio = new Date(inicio);
    const now = new Date()
    const dataFim = new Date(dataInicio.getTime() + 30 * 60 * 1000); 

    if (dataInicio.getTime() < Date.now()) {
        return res.status(400).json({
            status: "error",
            message: "Não é permitido agendar consultas no passado"
        })
    }

    if (!numero) {
        return res.status(400).json ({
            status: "error",
            message: "O número da residência é obrigatório"
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
        return res.status(400).json({ message: "Já existe uma consulta agendada para este horário" });
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
        return res.status(404).json({ error: "Consulta não encontrada" });
    }

    if (appointment.userId !== req.user.id && req.user.cargo !== 'SECRETARIO') {
        return res.status(403).json({ error: "Você não está autorizado a excluir esta consulta" });
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
        message: "Consulta deletada com sucesso" 
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
        return res.status(404).json({ error: "Consulta não encontrada" });
    }

    if (appointment.userId !== req.user.id && req.user.cargo !== 'SECRETARIO') {
        return res.status(403).json({ error: "Você não está autorizado a atualizar esta consulta" });
    }

    if (cep !== undefined || numero !== undefined || complemento !== undefined) {

        const addressUpdate = {};

        if (cep !== undefined && cep !== null && cep !== "") {

            const cepRegex = /^\d{5}-?\d{3}$/;
            if (!cepRegex.test(cep)) {
                return res.status(400).json({
                    message: "CEP deve ter 8 números, no formato 00000-000"
                });
            }

            let cepData;
            try {
                cepData = await getCepData(cep);
            } catch (err) {
                return res.status(400).json({ message: "CEP não encontrado" });
            }

            if (!cepData || cepData.erro) {
                return res.status(400).json({ message: "CEP inválido" });
            }

            console.log("foi");
            
            addressUpdate.cep = cep.replace(/\D/g, "");
            addressUpdate.logradouro = cepData.logradouro;
            addressUpdate.bairro = cepData.bairro;
            addressUpdate.cidade = cepData.localidade;
            addressUpdate.estado = cepData.uf;
        }

        if (numero !== undefined && numero !== null) {
            addressUpdate.numero = numero;
        }

        if (complemento !== undefined && complemento !== null) {
            addressUpdate.complemento = complemento;
        }
      
        if (Object.keys(addressUpdate).length > 0) {
            await prisma.address.update({
                where: { id: appointment.addressId },
                data: addressUpdate
            });
        }
    }

    const updateData = {};
    
    if (notas !== undefined) {
        updateData.notas = notas;
    }
    
    if (inicio !== undefined && inicio !== null && inicio !== "") {
    
        const dataInicio = new Date(`${inicio}:00`);

        if (isNaN(dataInicio.getTime())) {
            return res.status(400).json({
                error: "Data inválida"
            });
        }
        const dataFim = new Date(dataInicio.getTime() + 30 * 60 * 1000);

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
            return res.status(400).json({ error: "Já existe uma consulta para esse horário" });
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
        message: "Consulta atualizada com sucesso",
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