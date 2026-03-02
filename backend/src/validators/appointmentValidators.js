import { z } from "zod";

const addAppointmentSchema = z.object({
    inicio: z.string().refine((date) => !isNaN(Date.parse(date)), {
        message: "Invalid date format"
    }),
    endereco: z.string().min(1, "Address is required"),
    notas: z.string().optional()
})

//Utiliza a mesma lógica do add, porém com os campos sendo opcionais
const updateAppointmentSchema = addAppointmentSchema.partial();

export { addAppointmentSchema, updateAppointmentSchema }
