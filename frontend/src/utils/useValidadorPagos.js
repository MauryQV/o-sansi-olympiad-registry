// src/hooks/useValidadorPagos.js
//modulo de  pagos 
import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { esTerminoValido } from '../forms/validadorPagosValidator';
import { mostrarConfirmacionPago } from '../components/cajero/ConfirmacionPagoModal';
import axios from 'axios';

export const useValidadorPagos = () => {
  const [criterio, setCriterio] = useState('codigo');
  const [termino, setTermino] = useState('');
  const [boletas, setBoletas] = useState([]);
  const [boletasOriginal, setBoletasOriginal] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const cargarPagos = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No se encontró el token de autenticación');
      }

      // Obtener pagos pendientes
      const responsePendientes = await axios.get('http://localhost:7777/api/pagos/pendientes', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      // Obtener pagos realizados
      const responseRealizados = await axios.get('http://localhost:7777/api/pagos/realizados', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      // Combinar ambos resultados
      const todosLosPagos = [...responsePendientes.data, ...responseRealizados.data];

      const pagosAdaptados = todosLosPagos.map(pago => ({
        id: pago.id,
        codigo: pago.codigo_pago,
        competidor: `${pago.inscripcion.competidor.usuario.nombre} ${pago.inscripcion.competidor.usuario.apellido}`,
        ci: pago.inscripcion.competidor.carnet_identidad,
        monto: parseFloat(pago.monto),
        fecha: new Date(pago.fecha_pago).toLocaleDateString(),
        estado: pago.estado
      }));

      setBoletas(pagosAdaptados);
      setBoletasOriginal(pagosAdaptados);
      setError(null);
    } catch (error) {
      console.error('Error al cargar pagos:', error);
      setError(error.response?.data?.message || 'Error al cargar los pagos');
      setBoletas([]);
      setBoletasOriginal([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarPagos();
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
      const token = localStorage.getItem('token');
      const response = await axios.patch(`http://localhost:7777/api/pagos/validar-pago/${boleta.id}`, {}, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.data.success) {
        // Recargar todos los pagos después de validar
        await cargarPagos();

        Swal.fire({
          icon: 'success',
          title: '¡Pago Validado!',
          text: response.data.message || 'El pago fue registrado correctamente.',
          confirmButtonColor: '#4caf50'
        });
      } else {
        throw new Error(response.data.error || 'Error al validar el pago');
      }
    } catch (error) {
      console.error('Error al validar pago:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.response?.data?.error || error.message || 'No se pudo validar el pago. Intente nuevamente.',
        confirmButtonColor: '#e53935'
      });
    }
  };

  return {
    criterio, setCriterio,
    termino, setTermino,
    boletas, error, loading,
    handleBuscar, handleResetear, confirmarValidacion,
    esTerminoValido
  };
};
