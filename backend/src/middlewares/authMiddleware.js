import supabase from "../config/supabaseClient.js";

export const authMiddleware = async (req, res, next) => {
    const token = req.header("Authorization");

    if (!token) return res.status(403).json({ error: "Acceso denegado" });

    const { data, error } = await supabase.auth.getUser(token);

    if (error) return res.status(401).json({ error: "Token inválido" });

    req.user = data.user;
    next();
};
