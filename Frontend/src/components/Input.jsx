import './Input.css';

export const Input = ({ 
  label, 
  id, 
  type = 'text', 
  placeholder, 
  value, 
  onChange, 
  error, 
  required = false,
  disabled = false,
  ...props 
}) => {
  return (
    <div className="input-group">
      {label && (
        <label htmlFor={id} className="input-label">
          {label}
          {required && <span className="required">*</span>}
        </label>
      )}
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={`input ${error ? 'input-error' : ''}`}
        {...props}
      />
      {error && <span className="error-message">{error}</span>}
    </div>
  );
};
