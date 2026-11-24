import './campo-texto.css';

/**
 * Campo de formulario con etiqueta asociada y mensaje de error accesible.
 * Soporta input, select y textarea para no repetir el mismo bloque en cada página.
 * @param {string} id - Identificador único; enlaza la etiqueta con el campo.
 * @param {string} etiqueta - Texto visible de la etiqueta.
 * @param {boolean} obligatorio - Marca el campo como obligatorio (asterisco visible y aria-required).
 * @param {string} error - Mensaje de error; si existe, el campo se marca como inválido.
 * @param {'input'|'select'|'textarea'} componente - Elemento a renderizar.
 */
function CampoTexto({
  id,
  etiqueta,
  error,
  obligatorio = false,
  componente = 'input',
  children,
  ...resto
}) {
  const idError = `${id}-error`;
  const propsAccesibilidad = {
    id,
    name: id,
    'aria-required': obligatorio || undefined,
    'aria-invalid': Boolean(error),
    'aria-describedby': error ? idError : undefined,
    ...resto,
  };

  let control;
  if (componente === 'select') {
    control = <select {...propsAccesibilidad}>{children}</select>;
  } else if (componente === 'textarea') {
    control = <textarea {...propsAccesibilidad} />;
  } else {
    control = <input {...propsAccesibilidad} />;
  }

  return (
    <div className="campo-texto">
      <label htmlFor={id}>
        {etiqueta}
        {obligatorio && (
          <span className="campo-texto-obligatorio" aria-hidden="true">
            {' '}
            *
          </span>
        )}
      </label>
      {control}
      {error && (
        <span id={idError} className="campo-texto-error" role="alert">
          {error}
        </span>
      )}
    </div>
  );
}

export default CampoTexto;
