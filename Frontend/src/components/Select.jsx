import './Input.css';
import './Select.css';

/**
 * options: Array<{ id: number|string, name: string } | string>
 */
export const Select = ({
  label,
  id,
  options = [],
  value,
  onChange,
  error,
  required = false,
  disabled = false,
  placeholder = 'Select an option',
  name,
}) => (
  <div className="field">
    {label && (
      <label htmlFor={id} className="field-label">
        {label}
        {required && <span className="required">*</span>}
      </label>
    )}
    <div className="select-wrapper">
      <select
        id={id}
        name={name || id}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={`field-input field-select${error ? ' has-error' : ''}`}
      >
        <option value="">{placeholder}</option>
        {options.map((opt) => {
          const optValue = typeof opt === 'object' ? opt.id : opt;
          const optLabel = typeof opt === 'object' ? opt.name : opt;
          return (
            <option key={optValue} value={optValue}>
              {optLabel}
            </option>
          );
        })}
      </select>
    </div>
    {error && <span className="field-error">⚠ {error}</span>}
  </div>
);
