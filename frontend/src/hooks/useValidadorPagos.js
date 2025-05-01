// src/hooks/useValidadorPagos.js
//modulo de  pagos 
import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { esTerminoValido } from '../forms/validadorPagosValidator';
import { mostrarConfirmacionPago } from '../components/cajero/ConfirmacionPagoModal';

export const useValidadorPagos = () => {
  const [criterio, setCriterio] = useState('codigo');
  const [termino, setTermino] = useState('');
  const [boletas, setBoletas] = useState([]);
  const [boletasOriginal, setBoletasOriginal] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    setTimeout(() => {
      const datosSimulados = [
        { codigo: 'BOL-2024-001', competidor: 'Lidia Veizaga', ci: '4567890', monto: 15.0, fecha: '2025-04-01' },
        { codigo: 'BOL-2024-002', competidor: 'Juan Pérez', ci: '1234567', monto: 20.0, fecha: '2025-04-02' }
      ];
      setBoletas(datosSimulados);
      setBoletasOriginal(datosSimulados);
    }, 1000);
  }, []);

  const handleBuscar = () => {
    const t = termino.trim().toLowerCase();
    const filtradas = boletasOriginal.filter((b) => {
      if (criterio === 'codigo') return b.codigo.toLowerCase().includes(t);
      if (criterio === 'nombre') return b.competidor.toLowerCase().includes(t);
      if (criterio === 'ci') return b.ci.includes(t);
      return false;
    });
    setBoletas(filtradas);
  };

  const handleResetear = () => {
    setTermino('');
    setBoletas(boletasOriginal);
  };

  const confirmarValidacion = async (boleta) => {
    const confirmado = await mostrarConfirmacionPago(boleta);
    if (!confirmado) return;

    try {
      await fetch('/api/validar-pago', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ codigo: boleta.codigo })
      });

      const actualizadas = boletas.filter(b => b.codigo !== boleta.codigo);
      setBoletas(actualizadas);
      setBoletasOriginal(actualizadas);

      Swal.fire({
        icon: 'success',
        title: '¡Pago Validado!',
        text: 'El pago fue registrado correctamente.',
        confirmButtonColor: '#4caf50'
      });
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo validar el pago. Intente nuevamente.',
        confirmButtonColor: '#e53935'
      });
    }
  };

  return {
    criterio, setCriterio,
    termino, setTermino,
    boletas, error,
    handleBuscar, handleResetear, confirmarValidacion,
    esTerminoValido
  };
};
