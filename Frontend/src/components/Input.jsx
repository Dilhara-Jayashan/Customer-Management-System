import './Input.css';

export const Input = ({
  label,
  id,
  type = 'text',
  placeholder,
  value,
  onChange,
  error,
  hint,
  required = false,
  disabled = false,
  name,
  ...props
}) => (
  <div className="field">
    {label && (
      <label htmlFor={id} className="field-label">
        {label}
        {required && <span className="required">*</span>}
      </label>
    )}
    <input
      id={id}
      name={name || id}
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      disabled={disabled}
      className={`field-input${error ? ' has-error' : ''}`}
      autoComplete="off"
      {...props}
    />
    {error && <span className="field-error">⚠ {error}</span>}
    {hint && !error && <span className="field-hint">{hint}</span>}
  </div>
);
