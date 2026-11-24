/** Logo, nombre y subtítulo de Micron para las pantallas previas al ingreso. */
function MarcaMicron({ subtitulo }) {
  return (
    <>
      <div className="auth-logo" aria-hidden="true">
        <svg viewBox="0 0 24 24" width="28" height="28" fill="white">
          <path d="M13 3v6l2-2 2 2V3h2a1 1 0 011 1v16a1 1 0 01-1 1H5a1 1 0 01-1-1V4a1 1 0 011-1h8zm-2 8H7v2h4v-2zm4 4H7v2h8v-2z" />
        </svg>
      </div>
      <h1 className="auth-title">Micron</h1>
      <p className="auth-subtitle">{subtitulo}</p>
    </>
  );
}

export default MarcaMicron;
