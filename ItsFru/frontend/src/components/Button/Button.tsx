import React from 'react';
import styles from './Button.module.css';

type ButtonProps = {
  label: string;
  onClick?: () => void; // onClick을 선택적으로 변경
  disabled?: boolean;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
};

const Button: React.FC<ButtonProps> = ({ label, onClick, disabled = false, className, type = 'button' }) => {
  return (
    <button
      type={type}
      className={`${styles.button} ${className}`}
      onClick={onClick} // onClick이 선택적이므로 전달되지 않을 수도 있음
      disabled={disabled}
    >
      {label}
    </button>
  );
};

export default Button;