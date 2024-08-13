import React, { useState } from 'react';
import { useRouter } from 'next/router'; // Next.js의 useRouter 훅을 사용
import styles from '@styles/signup.module.css';

interface SignupProps {}

const Signup: React.FC<SignupProps> = () => {
  const router = useRouter(); // useRouter 훅 초기화
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [privacyConsent, setPrivacyConsent] = useState(false);

  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [privacyConsentError, setPrivacyConsentError] = useState('');

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setName(value);
    setNameError(value ? '' : '');
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    setEmailError(value.includes('@') || value === '' ? '' : '유효한 이메일 주소를 입력해 주세요.');
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);
    setPasswordError(value.length >= 6 || value === '' ? '' : '비밀번호는 6자 이상이어야 합니다.');
  };

  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setConfirmPassword(value);
    setConfirmPasswordError(value === password || value === '' ? '' : '비밀번호가 일치하지 않습니다.');
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, ''); // 숫자만 남기기
    setPhone(value);
    setPhoneError(value.length >= 10 || value === '' ? '' : '유효한 전화번호를 입력해 주세요.');
  };

  const handlePrivacyConsentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPrivacyConsent(e.target.checked);
    setPrivacyConsentError(e.target.checked ? '' : '개인정보 이용에 동의해 주세요.');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!privacyConsent) {
      setPrivacyConsentError('개인정보 이용에 동의해 주세요.');
    }
    // 여기에 추가적인 폼 제출 로직을 추가하세요
  };

  const handleLoginClick = () => {
    router.push('/login'); // login.tsx로 이동
  };

  return (
    <div className={styles.signupContainer}>
      <h1 className={styles.title}>회원 가입</h1>
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.inputContainer}>
          <label>이름</label>
          <input
            className={styles.input}
            type="text"
            placeholder="이름을 입력해 주세요"
            value={name}
            onChange={handleNameChange}
          />
          <span className={`${styles.error} ${nameError ? styles.errorVisible : ''}`}>{nameError}</span>
        </div>

        <div className={styles.inputContainer}>
          <label>이메일 주소</label>
          <input
            className={styles.input}
            type="email"
            placeholder="이메일 주소를 입력해 주세요"
            value={email}
            onChange={handleEmailChange}
          />
          <span className={`${styles.error} ${emailError ? styles.errorVisible : ''}`}>{emailError}</span>
        </div>

        <div className={styles.inputContainer}>
          <label>비밀번호</label>
          <input
            className={styles.input}
            type="password"
            placeholder="비밀번호를 입력해 주세요"
            value={password}
            onChange={handlePasswordChange}
          />
          <span className={`${styles.error} ${passwordError ? styles.errorVisible : ''}`}>{passwordError}</span>
        </div>

        <div className={styles.inputContainer}>
          <label>비밀번호 확인</label>
          <input
            className={styles.input}
            type="password"
            placeholder="비밀번호를 재입력 해주세요"
            value={confirmPassword}
            onChange={handleConfirmPasswordChange}
          />
          <span className={`${styles.error} ${confirmPasswordError ? styles.errorVisible : ''}`}>{confirmPasswordError}</span>
        </div>

        <div className={styles.inputContainer}>
          <label>휴대 전화</label>
          <input
            className={styles.input}
            type="tel"
            placeholder="전화번호를 입력해 주세요"
            value={phone}
            onChange={handlePhoneChange}
          />
          <span className={`${styles.error} ${phoneError ? styles.errorVisible : ''}`}>{phoneError}</span>
        </div>

        <div className={styles.checkboxContainer}>
          <input type="checkbox" id="privacyConsent" checked={privacyConsent} onChange={handlePrivacyConsentChange} />
          <label htmlFor="privacyConsent" className={styles.checkboxLabel}>(필수) 개인정보 이용에 동의합니다</label>
          <span className={`${styles.error} ${privacyConsentError ? styles.errorVisible : ''}`}>{privacyConsentError}</span>
        </div>

        <div className={styles.checkboxContainer}>
          <input type="checkbox" id="smsConsent" />
          <label htmlFor="smsConsent" className={styles.checkboxLabel}>(선택) 혜택 SMS 수신에 동의합니다</label>
        </div>

        <button type="submit" className={styles.button}>회원 가입</button>
      </form>
      <p className={styles.loginText}>
        이미 계정이 있으신가요? <span onClick={handleLoginClick} className={styles.loginLink}>로그인하기</span>
      </p>
    </div>
  );
};

export default Signup;