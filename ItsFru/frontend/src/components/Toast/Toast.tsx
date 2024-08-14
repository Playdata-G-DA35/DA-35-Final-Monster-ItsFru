import React from 'react';
import styles from './toast.module.css';

interface ToastProps {
  message: string;
  visible: boolean;
}

const Toast: React.FC<ToastProps> = ({ message, visible }) => {
  return (
    <div className={`${styles.toast} ${visible ? styles.show : ''}`}>
      {message}
    </div>
  );
};

export default Toast;