// Input.tsx (또는 Input 컴포넌트가 정의된 파일)

import React, { ChangeEvent } from 'react';

interface InputProps {
  name: string;
  type: string;
  placeholder: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  className?: string; // className 속성 추가
}

const Input: React.FC<InputProps> = ({ name, type, placeholder, value, onChange, className }) => {
  return (
    <input
      name={name}
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className={className} // className 적용
    />
  );
};

export default Input;