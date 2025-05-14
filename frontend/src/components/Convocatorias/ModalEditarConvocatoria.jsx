import '../../styles/Convocatorias/ModalNuevaConvocatoria.css';
import { useEditarConvocatoria } from '../../hooks/useEditarConvocatoria';

const ModalEditarConvocatoria = ({ visible, cerrar, convocatoriaId, recargarConvocatorias }) => {
  const {
    formulario,
    errores,
    cargando,
    areasDisponibles,
    estadosDisponibles,
    manejarCambio,
    manejarCheckbox,
    manejarSubmit
  } = useEditarConvocatoria({ visible, convocatoriaId, recargarConvocatorias, cerrar });

  if (!visible) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-convocatoria">
        <h3>Editar Convocatoria</h3>
        <p>Complete la información para actualizar la convocatoria</p>
        
        {cargando ? (
          <div className="cargando-container">
            <p>Cargando información...</p>
          </div>
        ) : (
          <form className="modal-form" onSubmit={manejarSubmit}>
            
            {/* Nombre */}
            <div className="form-group">
              <label>Nombre *</label>
              <input
                type="text"
                name="nombre"
                value={formulario.nombre || 'no hay nada'}
                onChange={manejarCambio}
                className={errores.nombre ? 'input-error' : ''}
              />
              {errores.nombre && <span className="error-text">{errores.nombre}</span>}
            </div>

            {/* Estado */}
            <div className="form-group">
              <label>Estado *</label>
              <select
                name="id_estado_convocatoria"
                value={formulario.id_estado_convocatoria || ''}
                onChange={manejarCambio}
                className={errores.id_estado_convocatoria ? 'input-error' : ''}
              >
                <option value="">Seleccione un estado</option>
                {estadosDisponibles.map((estado) => (
                  <option key={estado.id} value={estado.id}>
                    {estado.nombre}
                  </option>
                ))}
              </select>
              {errores.id_estado_convocatoria && <span className="error-text">{errores.id_estado_convocatoria}</span>}
            </div>

            {/* Descripción */}
            <div className="form-group">
              <label>Descripción *</label>
              <textarea
                name="descripcion"
                value={formulario.descripcion || 'descripcion vacia'} 
                onChange={manejarCambio}
                className={errores.descripcion ? 'input-error' : ''}
              />
              {errores.descripcion && <span className="error-text">{errores.descripcion}</span>}
            </div>

            {/* Fechas */}
            <div className="input-row">
              <div className="form-group">
                <label>Fecha Inicio Inscripción *</label>
                <input
                  type="date"
                  name="inscripcionInicio"
                  value={formulario.inscripcionInicio || ''}
                  onChange={manejarCambio}
                  className={errores.inscripcionInicio ? 'input-error' : ''}
                />
                {errores.inscripcionInicio && <span className="error-text">{errores.inscripcionInicio}</span>}
              </div>
              <div className="form-group">
                <label>Fecha Fin Inscripción *</label>
                <input
                  type="date"
                  name="inscripcionFin"
                  value={formulario.inscripcionFin || ''}
                  onChange={manejarCambio}
                  className={errores.inscripcionFin ? 'input-error' : ''}
                />
                {errores.inscripcionFin && <span className="error-text">{errores.inscripcionFin}</span>}
              </div>
            </div>

            <div className="input-row">
              <div className="form-group">
                <label>Fecha Inicio Pago *</label>
                <input
                  type="date"
                  name="pagoInicio"
                  value={formulario.pagoInicio || ''}
                  onChange={manejarCambio}
                  className={errores.pagoInicio ? 'input-error' : ''}
                />
                {errores.pagoInicio && <span className="error-text">{errores.pagoInicio}</span>}
              </div>

              <div className="form-group">
                <label>Fecha Fin Pago *</label>
                <input
                  type="date"
                  name="pagoFin"
                  value={formulario.pagoFin || ''}
                  onChange={manejarCambio}
                  className={errores.pagoFin ? 'input-error' : ''}
                />
                {errores.pagoFin && <span className="error-text">{errores.pagoFin}</span>}
              </div>
            </div>

            <div className="input-row">
              <div className="form-group">
                <label>Fecha Inicio Competencia *</label>
                <input
                  type="date"
                  name="competenciaInicio"
                  value={formulario.competenciaInicio || ''}
                  onChange={manejarCambio}
                  className={errores.competenciaInicio ? 'input-error' : ''}
                />
                {errores.competenciaInicio && <span className="error-text">{errores.competenciaInicio}</span>}
              </div>

              <div className="form-group">
                <label>Fecha Fin Competencia *</label>
                <input
                  type="date"
                  name="competenciaFin"
                  value={formulario.competenciaFin || ''}
                  onChange={manejarCambio}
                  className={errores.competenciaFin ? 'input-error' : ''}
                />
                {errores.competenciaFin && <span className="error-text">{errores.competenciaFin}</span>}
              </div>
            </div>

            {/* Áreas */}
            <div className="form-group full-width">
              <label>Áreas de Competencia *</label>
              <div className={`modal-areas ${errores.areasSeleccionadas ? 'input-error' : ''}`}>
                {areasDisponibles.map((area) => (
                  <label key={area.id} className="checkbox-area">
                    <input
                      type="checkbox"
                      checked={formulario.areasSeleccionadas?.includes(area.id) || false}
                      onChange={() => manejarCheckbox(area.id)}
                    />
                    {area.nombre_area}
                  </label>
                ))}
              </div>
              {errores.areasSeleccionadas && <span className="error-text">{errores.areasSeleccionadas}</span>}
            </div>

            {/* Botones */}
            <div className="modal-botones">
              <button type="button" onClick={cerrar}>Cancelar</button>
              <button type="submit" className="btn-crear">Actualizar</button>
            </div>

          </form>
        )}
      </div>
    </div>
  );
};

export default ModalEditarConvocatoria;