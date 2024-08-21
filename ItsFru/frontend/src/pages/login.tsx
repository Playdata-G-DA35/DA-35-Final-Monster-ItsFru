import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { Button, Input } from '@components';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Signup: React.FC = () => {
  const router = useRouter();
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

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setName(value);
    setNameError(value ? '' : '이름을 입력해 주세요.');
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
    const value = e.target.value.replace(/\D/g, '');
    setPhone(value);
    setPhoneError(value.length >= 10 || value === '' ? '' : '유효한 전화번호를 입력해 주세요.');
  };

  const handlePrivacyConsentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPrivacyConsent(e.target.checked);
  };

  const validateForm = () => {
    let isValid = true;
    if (!name) {
      setNameError('이름을 입력해 주세요.');
      isValid = false;
    }
    if (!email.includes('@')) {
      setEmailError('유효한 이메일 주소를 입력해 주세요.');
      isValid = false;
    }
    if (password.length < 6) {
      setPasswordError('비밀번호는 6자 이상이어야 합니다.');
      isValid = false;
    }
    if (password !== confirmPassword) {
      setConfirmPasswordError('비밀번호가 일치하지 않습니다.');
      isValid = false;
    }
    if (phone.length < 10) {
      setPhoneError('유효한 전화번호를 입력해 주세요.');
      isValid = false;
    }
    if (!privacyConsent) {
      toast.error('개인정보 이용에 동의해 주세요.');
      isValid = false;
    }
    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      // 여기에 추가적인 폼 제출 로직을 추가하세요
      toast.success('회원 가입이 완료되었습니다.');
    }
  };

  const handleLoginClick = () => {
    router.push('/login');
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold text-center mb-6">회원 가입</h1>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <Input
          label="이름"
          type="text"
          placeholder="이름을 입력해 주세요"
          value={name}
          onChange={handleNameChange}
          error={nameError}
        />

        <Input
          label="이메일 주소"
          type="email"
          placeholder="이메일 주소를 입력해 주세요"
          value={email}
          onChange={handleEmailChange}
          error={emailError}
        />

        <Input
          label="비밀번호"
          type="password"
          placeholder="비밀번호를 입력해 주세요"
          value={password}
          onChange={handlePasswordChange}
          error={passwordError}
        />

        <Input
          label="비밀번호 확인"
          type="password"
          placeholder="비밀번호를 재입력 해주세요"
          value={confirmPassword}
          onChange={handleConfirmPasswordChange}
          error={confirmPasswordError}
        />

        <Input
          label="휴대 전화"
          type="tel"
          placeholder="전화번호를 입력해 주세요"
          value={phone}
          onChange={handlePhoneChange}
          error={phoneError}
        />

        <div className="flex items-center">
          <input
            type="checkbox"
            id="privacyConsent"
            checked={privacyConsent}
            onChange={handlePrivacyConsentChange}
            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
          />
          <label htmlFor="privacyConsent" className="ml-2 block text-sm text-gray-900">
            (필수) 개인정보 이용에 동의합니다
          </label>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="smsConsent"
            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
          />
          <label htmlFor="smsConsent" className="ml-2 block text-sm text-gray-900">
            (선택) 혜택 SMS 수신에 동의합니다
          </label>
        </div>

        <Button
          type="submit"
          label="회원 가입"
          className="w-full"
        />
      </form>
      <ToastContainer
        position="top-center"
        autoClose={2000}
        hideProgressBar
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <p className="mt-4 text-center text-sm text-gray-600">
        이미 계정이 있으신가요?{' '}
        <span onClick={handleLoginClick} className="font-bold text-green-700 hover:text-green-800 cursor-pointer">
          로그인하기
        </span>
      </p>
    </div>
  );
};

export default Signup;