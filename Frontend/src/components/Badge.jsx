import './Badge.css';

export const Badge = ({ children, variant = 'default', icon: Icon }) => (
  <span className={`badge badge-${variant}`}>
    {Icon && <Icon size={10} />}
    {children}
  </span>
);
