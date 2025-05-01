export const esTextoValido = (texto) => {
    const regex = /^[a-zA-ZÁÉÍÓÚáéíóúñÑ\s]*$/;
    return regex.test(texto) && texto.length <= 20;
  };
  
  export const tutorExiste = (lista, nombre, area) => {
    return lista.find(t => t.nombre === nombre && t.area === area);
  };
  
  export const tutorYaAgregado = (lista, nombre, area) => {
    return lista.some(t => t.nombre === nombre && t.area === area);
  };
  