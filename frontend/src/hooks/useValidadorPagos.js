// src/hooks/useValidadorPagos.js
//modulo de  pagos 
import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { esTerminoValido } from '../forms/validadorPagosValidator';
import { mostrarConfirmacionPago } from '../components/cajero/ConfirmacionPagoModal';
import { useSearchParams } from 'react-router-dom';
import {
  obtenerPagosPendientes,
  obtenerPagosRealizados,
  validarPago
} from '../services/pagosService';

export const useValidadorPagos = () => {
  const [searchParams] = useSearchParams();
  const estadoFiltro = searchParams.get('estado');

  const [criterio, setCriterio] = useState('codigo');
  const [termino, setTermino] = useState('');
  const [boletas, setBoletas] = useState([]);
  const [boletasOriginal, setBoletasOriginal] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const cargarPagos = async () => {
    try {
      setLoading(true);
      let pagosData = [];

      if (estadoFiltro === 'Pagado') {
        pagosData = await obtenerPagosRealizados();
      } else if (estadoFiltro === 'Pendiente') {
        pagosData = await obtenerPagosPendientes();
      } else {
        // Si no hay filtro, cargar todos los pagos
        const [pagosPendientes, pagosRealizados] = await Promise.all([
          obtenerPagosPendientes(),
          obtenerPagosRealizados()
        ]);
        pagosData = [...pagosPendientes, ...pagosRealizados];
      }

      const pagosAdaptados = pagosData.map(pago => ({
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
      setError(error.message || 'Error al cargar los pagos');
      setBoletas([]);
      setBoletasOriginal([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarPagos();
  }, [estadoFiltro]); // Recargar cuando cambie el estado en la URL

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
      const response = await validarPago(boleta.id);

      if (response.success) {
        // Recargar todos los pagos después de validar
        await cargarPagos();

        Swal.fire({
          icon: 'success',
          title: '¡Pago Validado!',
          text: response.message || 'El pago fue registrado correctamente.',
          confirmButtonColor: '#4caf50'
        });
      } else {
        throw new Error(response.error || 'Error al validar el pago');
      }
    } catch (error) {
      console.error('Error al validar pago:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.message || 'No se pudo validar el pago. Intente nuevamente.',
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