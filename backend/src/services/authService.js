import supabase from "../config/supabaseClient.js";

export const registerUser = async (email, password, role) => {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) throw new Error(error.message);

    return data.user;
};

export const loginUser = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw new Error("Credenciales incorrectas");

    return { user: data.user, token: data.session.access_token };
};

export const logoutUser = async () => {
    await supabase.auth.signOut();
};
