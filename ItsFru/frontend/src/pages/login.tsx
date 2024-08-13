import React, { useState } from 'react';
import Link from 'next/link';
import styles from '@styles/login.module.css';

interface LoginProps {
  // 필요한 props 정의
}

const Login: React.FC<LoginProps> = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (password === '1111') {
      alert('로그인 성공!');
    } else {
      setError('입력하신 내용과 일치하는 계정이 없습니다. 다시 입력해주세요.');
    }
  };

  return (
    <div className={styles.loginContainer}>
      <h1 className={styles.title}>로그인</h1>
      <form className={styles.form} onSubmit={handleSubmit}>
        <InputField label="이메일" type="email" value={email} onChange={setEmail} />
        <InputField label="비밀번호" type="password" value={password} onChange={setPassword} />
        <button type="submit" className={styles.button}>로그인</button>
      </form>
      {error && <div className={styles.error}>{error}</div>}
      <div className={styles.socialLogin}>
        <button className={styles.socialButton}>Google로 로그인</button>
        <button className={styles.socialButton}>Facebook으로 로그인</button>
      </div>
      <div className={styles.findInfo}>비밀번호를 잊으셨나요?</div>
      <div className={styles.signupLink}>
        <span>계정이 없으신가요? </span>
        <Link href="/signup" className={styles.signupText}>
          회원가입
        </Link>
      </div>
    </div>
  );
};

interface InputFieldProps {
  label: string;
  type: string;
  value: string;
  onChange: (value: string) => void;
}

const InputField: React.FC<InputFieldProps> = ({ label, type, value, onChange }) => (
  <div style={{ position: 'relative' }}>
    <label>{label}</label>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  </div>
);

export default Login;