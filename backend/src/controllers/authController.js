import { prisma } from "../config/db.js";
import bcrypt from 'bcryptjs';  

const register = async (req, res) => {
    const {name, email, password, role} = req.body;
    
    //Check if email already exists in the database
    const userExists = await prisma.user.findUnique({
         where: { email: email},
    });

    if (userExists) {
        return res.status(400).json({ error: "Email already in use" });
    }

    //Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    //Create new user in the database
    const newUser = await prisma.user.create({
        data: {
            name,
            email,
            password: hashedPassword,
            role,
        },
    });

    res.status(201).json({
        status: "success",
        data: {
            user: { 
                id: newUser.id,
                name: name,
                email: email,
                role: role
            }}     
        });
}

export { register };