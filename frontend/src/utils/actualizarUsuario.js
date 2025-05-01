export const actualizarUsuarioEnLista = (usuarios, usuarioActualizado) => {
    return usuarios.map(user =>
      user.id === usuarioActualizado.id ? { ...user, ...usuarioActualizado } : user
    );
  };