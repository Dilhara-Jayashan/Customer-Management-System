import ReactDatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './DatePicker.css';

export const DatePicker = ({ 
  label, 
  id, 
  selected, 
  onChange, 
  error, 
  required = false,
  disabled = false,
  maxDate = new Date(),
  placeholderText = 'Select a date',
  ...props 
}) => {
  return (
    <div className="date-picker-group">
      {label && (
        <label htmlFor={id} className="date-picker-label">
          {label}
          {required && <span className="required">*</span>}
        </label>
      )}
      <ReactDatePicker
        id={id}
        selected={selected}
        onChange={onChange}
        disabled={disabled}
        maxDate={maxDate}
        placeholderText={placeholderText}
        className={`date-picker-input ${error ? 'date-picker-error' : ''}`}
        dateFormat="yyyy-MM-dd"
        {...props}
      />
      {error && <span className="error-message">{error}</span>}
    </div>
  );
};
