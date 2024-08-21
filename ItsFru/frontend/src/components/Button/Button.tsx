import React from 'react';

type ButtonProps = {
  label?: string; // 기존 label을 optional로 변경
  children?: React.ReactNode; // children 속성 추가
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
};

const Button: React.FC<ButtonProps> = ({
  label,
  children,
  onClick,
  disabled = false,
  className = '',
  type = 'button',
}) => {
  return (
    <button
      type={type}
      className={`py-2 px-4 rounded-md shadow-sm text-lg font-bold text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 ${className}`}
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
    >
      {children || label}
    </button>
  );
};

export default Button;