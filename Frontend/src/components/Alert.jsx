import './Alert.css';
import { AlertCircle, CheckCircle, Info, AlertTriangle } from 'lucide-react';

export const Alert = ({ 
  type = 'info', 
  message, 
  onClose,
  dismissible = true
}) => {
  const iconMap = {
    success: <CheckCircle size={20} />,
    error: <AlertCircle size={20} />,
    warning: <AlertTriangle size={20} />,
    info: <Info size={20} />,
  };

  return (
    <div className={`alert alert-${type}`}>
      <div className="alert-content">
        {iconMap[type]}
        <span>{message}</span>
      </div>
      {dismissible && (
        <button 
          className="alert-close"
          onClick={onClose}
          aria-label="Close alert"
        >
          ×
        </button>
      )}
    </div>
  );
};
