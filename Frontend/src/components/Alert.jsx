import { CheckCircle, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';
import './Alert.css';

const ICONS = {
  success: CheckCircle,
  error:   AlertCircle,
  warning: AlertTriangle,
  info:    Info,
};

export const Alert = ({ type = 'info', title, message, onClose }) => {
  const Icon = ICONS[type] || Info;
  return (
    <div className={`alert alert-${type}`} role="alert">
      <span className="alert-icon"><Icon size={18} /></span>
      <div className="alert-content">
        {title && <div className="alert-title">{title}</div>}
        <div className="alert-message">{message}</div>
      </div>
      {onClose && (
        <button className="alert-close" onClick={onClose} aria-label="Dismiss">
          <X size={16} />
        </button>
      )}
    </div>
  );
};
