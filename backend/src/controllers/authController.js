import { registerUser, loginUser, logoutUser } from "../services/authService.js";
import prisma from "../config/prismaClient.js";

export const register = async (req, res) => {
    try {
        const { email, password, role } = req.body;
        const user = await registerUser(email, password, role);

        await prisma.user.create({
            data: {
                id: user.id,
                email,
                role: role || "user",
            },
        });

        res.status(201).json({ message: "Usuario registrado con éxito", user });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const { user, token } = await loginUser(email, password);

        res.json({ message: "Inicio de sesión exitoso", user, token });
    } catch (error) {
        res.status(401).json({ error: error.message });
    }
};

export const logout = async (req, res) => {
    try {
        await logoutUser();
        res.json({ message: "Sesión cerrada" });
    } catch (error) {
        res.status(500).json({ error: "Error al cerrar sesión" });
    }
};
