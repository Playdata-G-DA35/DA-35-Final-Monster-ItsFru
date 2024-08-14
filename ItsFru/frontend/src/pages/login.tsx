import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import styles from '@styles/login.module.css';
import Button from '@components/Button'; // Button 컴포넌트 import
import Input from '@components/Input'; // Input 컴포넌트 import

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = () => {
    if (password === '1111') {
      alert('로그인 성공!');
      sessionStorage.setItem('isLoggedIn', 'true');
      router.push('/main');
    } else {
      setError('입력하신 내용과 일치하는 계정이 없습니다. 다시 입력해주세요.');
    }
  };
  
  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleSubmit();
  };
  
  return (
    <div className={styles.loginContainer}>
      <h1 className={styles.title}>로그인</h1>
      <form className={styles.form} onSubmit={handleFormSubmit}>
        <Input name="email" type="email" placeholder="이메일" value={email} onChange={(e) => setEmail(e.target.value)} />
        <Input name="password" type="password" placeholder="비밀번호" value={password} onChange={(e) => setPassword(e.target.value)} />
        <Button type="submit" label="로그인" className={styles.button} /> {/* onClick 제거 */}
      </form>
      {error && <div className={styles.error}>{error}</div>}
      <div className={styles.socialLogin}>
        <Button label="Google로 로그인" onClick={() => {}} className={styles.socialButton} />
        <Button label="Facebook으로 로그인" onClick={() => {}} className={styles.socialButton} />
      </div>
      <div className={styles.findInfo}>비밀번호를 잊으셨나요?</div>
      <div className={styles.signupLink}>
        <span>아직 계정이 없으신가요? </span>
        <Link href="/signup" className={styles.signupText}>
          회원가입
        </Link>
      </div>
    </div>
  );
};

export default Login;