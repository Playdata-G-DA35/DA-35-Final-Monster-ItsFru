import React from 'react';
import styles from './Input.module.css';

type InputProps = {
  name: string; // name 속성 추가
  type: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

const Input: React.FC<InputProps> = ({ name, type, placeholder, value, onChange }) => {
  return (
    <input
      className={styles.input}
      name={name} // name 속성 추가
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
    />
  );
};

export default Input;