

export const generarPassword = () => {
    const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let pass = '';
    for (let i = 0; i < 10; i++) {
        pass += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
    }
    return pass;
}