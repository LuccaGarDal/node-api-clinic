import { z } from "zod";

const addAppointmentSchema = z.object({
    inicio: z.string().refine((date) => !isNaN(Date.parse(date)), {
        message: "Formato de data inválido"
    }),
    cep: z.string().regex(/^\d{5}-?\d{3}$/, {
        message: "CEP inválido. Use o formato 00000-000"
    }),
    numero: z.string(),
    complemento: z.string().optional(),
    notas: z.string().optional()
});


//Utiliza a mesma lógica do add, porém com os campos sendo opcionais
const updateAppointmentSchema = addAppointmentSchema.partial();

export { addAppointmentSchema, updateAppointmentSchema }
