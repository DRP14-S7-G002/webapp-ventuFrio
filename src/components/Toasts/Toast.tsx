import React, { useEffect } from 'react';
import styles from './style.module.css';
import { FiCheckCircle, FiAlertCircle, FiInfo, FiAlertTriangle } from 'react-icons/fi';

interface ToastProps {
  type: 'success' | 'error' | 'processing' | 'alert';
  message: string;
  onClose: () => void;
}

const icons = {
  success: <FiCheckCircle className={styles.icon} />,
  error: <FiAlertCircle className={styles.icon} />,
  processing: <FiInfo className={styles.icon} />,
  alert: <FiAlertTriangle className={styles.icon} />,
};

export const Toast: React.FC<ToastProps> = ({ type, message, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`${styles.toast} ${styles[type]}`}>
      {icons[type]}
      <p>{message}</p>
    </div>
  );
};
