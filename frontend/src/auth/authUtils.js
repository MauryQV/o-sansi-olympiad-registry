// src/auth/authUtils.js
const TOKEN_KEY = "token";
const USER_KEY = "usuario";

export const saveAuthData = (token, usuario) => {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(usuario));
};

export const getAuthToken = () => localStorage.getItem(TOKEN_KEY);

export const getUsuarioActual = () => {
    const user = localStorage.getItem(USER_KEY);
    return user ? JSON.parse(user) : null;
};

export const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
};
