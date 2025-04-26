import supabase from "../config/supabaseClient.js";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;


export const authMiddleware = async (req, res, next) => {
    const token = req.header("Authorization");

    if (!token) return res.status(403).json({ error: "Acceso denegado" });

    const { data, error } = await supabase.auth.getUser(token);

    if (error) return res.status(401).json({ error: "Token inválido" });

    req.user = data.user;
    next();
};


export const verificarToken = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) return res.status(401).json({ error: 'Token requerido' });

    const token = authHeader.split(' ')[1];

    jwt.verify(token, JWT_SECRET, (err, usuario) => {
        if (err) return res.status(403).json({ error: 'Token inválido o expirado' });
        req.usuario = usuario;
        next();
    });
};
