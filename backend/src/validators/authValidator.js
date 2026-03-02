import { email, z } from "zod";

const registerSchema = z.object({
    nome: z
        .string()
        .trim()
        .min(2, "O nome deve ter no mínimo duas letras"),
    email: z
        .string()
        .trim()
        .min(1, "O e-mail é obrigatório")
        .email("Insira um e-mail válido")
        .toLowerCase(),
    senha: z
        .string()
        .min(1, "A senha é obrigatória")
        .min(6, "A senha deve ter pelo menos 6 caractéres"),
    cargo: z
        .enum(["PACIENTE", "SECRETARIO"], {
            error: () => ({
                message: "O cargo deve ser um desses: PACIENTE ou SECRETARIO",
            }),
        })
});

const loginSchema = z.object({
    email: z
        .string()
        .trim()
        .min(1, "O e-mail é obrigatório")
        .email("Insira um e-mail válido")
        .toLowerCase(),
    senha: z
        .string()
        .min(1, "A senha é obrigatória")
});

export { registerSchema, loginSchema };