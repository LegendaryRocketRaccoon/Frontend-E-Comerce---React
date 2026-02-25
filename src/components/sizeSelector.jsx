import './SizeSelector.scss';

export default function SizeSelector({ sizes, selected, onChange }) {
  if (!sizes || sizes.length === 0) return null;

  return (
    <div className="size-selector">
      <p className="size-selector__label">
        Tamanho
        {selected && <span className="size-selector__selected-tag">{selected}</span>}
      </p>
      <div className="size-selector__options">
        {sizes.map(size => (
          <button
            key={size}
            type="button"
            className={`size-selector__btn ${selected === size ? 'active' : ''}`}
            onClick={() => onChange(size)}
            aria-pressed={selected === size}
          >
            {size}
          </button>
        ))}
      </div>
      {!selected && (
        <p className="size-selector__hint">Selecione um tamanho para continuar</p>
      )}
    </div>
  );
}