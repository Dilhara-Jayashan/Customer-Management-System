import ReactDatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './DatePicker.css';
import './Input.css';

export const DatePicker = ({
  label,
  id,
  selected,
  onChange,
  error,
  required = false,
  disabled = false,
  placeholder = 'YYYY-MM-DD',
  maxDate,
}) => (
  <div className="field">
    {label && (
      <label htmlFor={id} className="field-label">
        {label}
        {required && <span className="required">*</span>}
      </label>
    )}
    <ReactDatePicker
      id={id}
      selected={selected}
      onChange={onChange}
      dateFormat="yyyy-MM-dd"
      placeholderText={placeholder}
      disabled={disabled}
      maxDate={maxDate || new Date()}
      showYearDropdown
      showMonthDropdown
      dropdownMode="select"
      autoComplete="off"
      className={error ? 'has-error' : ''}
    />
    {error && <span className="field-error">⚠ {error}</span>}
  </div>
);
