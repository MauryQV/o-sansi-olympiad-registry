import Swal from 'sweetalert2';

export const mostrarConfirmacionPago = (boleta) => {
  return Swal.fire({
    title: 'Confirmar Validación de Pago',
    html: `
      <p style="font-size: 1.05rem; margin-bottom: 1.5rem;">¿Está seguro de que desea cobrar el pago de esta boleta?</p>
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; font-size: 0.95rem;">
        <div>
          <p style="color: #666; margin: 0;">Código de Boleta</p>
          <p style="font-weight: 600; margin: 4px 0;">${boleta.codigo}</p>
        </div>
        <div>
          <p style="color: #666; margin: 0;">Competidor</p>
          <p style="font-weight: 600; margin: 4px 0;">${boleta.competidor}</p>
        </div>
        <div>
          <p style="color: #666; margin: 0;">Monto</p>
          <p style="margin: 4px 0;">Bs. ${boleta.monto.toFixed(2)}</p>
        </div>
        <div>
          <p style="color: #666; margin: 0;">Fecha</p>
          <p style="margin: 4px 0;">${boleta.fecha}</p>
        </div>
      </div>
      <div style="background-color: #fff8dc; padding: 12px; border-radius: 8px; margin-top: 20px; display: flex; align-items: center; gap: 10px; font-size: 0.9rem; color: #7c4b00;">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" stroke="#7c4b00" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12" y1="16" y2="16"/></svg>
        Esta acción confirmará que el pago ha sido recibido y completará la inscripción del competidor.
      </div>
    `,
    showCancelButton: true,
    confirmButtonText: 'Sí, Cobrar',
    cancelButtonText: 'Cancelar',
    confirmButtonColor: '#4caf50',
    cancelButtonColor: '#999',
    width: 600
  }).then((result) => result.isConfirmed);
};