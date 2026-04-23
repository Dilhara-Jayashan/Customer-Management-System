import './Select.css';

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
  ...props 
}) => {
  return (
    <div className="select-group">
      {label && (
        <label htmlFor={id} className="select-label">
          {label}
          {required && <span className="required">*</span>}
        </label>
      )}
      <select
        id={id}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={`select ${error ? 'select-error' : ''}`}
        {...props}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.id || option.value} value={option.id || option.value}>
            {option.name || option.label}
          </option>
        ))}
      </select>
      {error && <span className="error-message">{error}</span>}
    </div>
  );
};
