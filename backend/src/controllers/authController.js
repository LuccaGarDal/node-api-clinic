import { prisma } from "../config/db.js";
import bcrypt from 'bcryptjs'; 
import { generateToken } from "../utils/generateToken.js"; 

const register = async (req, res) => {
    const {nome, email, senha, cargo} = req.body;
    
    //Check if email already exists in the database
    const userExists = await prisma.user.findUnique({
         where: { email: email},
    });

    if (userExists) {
        return res.status(400).json({ error: "Email already in use" });
    }

    //Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(senha, salt);

    //Create new user in the database
    const user = await prisma.user.create({
        data: {
            nome,
            email,
            senha: hashedPassword,
            cargo,
        },
    });

    //Generate token
    const token = generateToken(user.id, res);

    res.status(201).json({
        status: "success",
        data: {
            user: { 
                id: user.id,
                nome: user.nome,
                email: user.email,
                cargo: user.cargo
            },
            token
        }     
        });
}

const login = async (req, res) => {
    const { email, senha } = req.body;

    //Check if user exists
    const user = await prisma.user.findUnique({
        where: { email: email },
    });

    if (!user) {
        return res.status(400).json({ error: "Invalid email or password" });
    }

    //Verify password
    const isPasswordValid = await bcrypt.compare(senha, user.senha);

    if (!isPasswordValid) {
        return res.status(400).json({ error: "Invalid email or password" });
    }   

    //Generate token
    const token = generateToken(user.id, res);

    res.status(201).json({
        status: "success",
        data: {
            user: {
                id: user.id,
                email: user.email,
                cargo: user.cargo
            },
            token
        }
    });
}

const logout = (req, res) => {
    res.cookie('jwt', '', {
        httpOnly: true,
        expires: new Date(0),
    });
    res.status(200).json({
        status: "success",
        message: "Logged out successfully" 
    });
}

export { register, login, logout };