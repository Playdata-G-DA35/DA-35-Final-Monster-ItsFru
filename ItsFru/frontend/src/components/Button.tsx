import React from 'react';
import styles from './Button.module.css'; // 스타일 모듈을 사용하여 CSS를 모듈화

type ButtonProps = {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  className?: string; // className prop 추가
};

const Button: React.FC<ButtonProps> = ({ label, onClick, disabled = false, className }) => {
  return (
    <button className={`${styles.button} ${className}`} onClick={onClick} disabled={disabled}>
      {label}
    </button>
  );
};

export default Button;