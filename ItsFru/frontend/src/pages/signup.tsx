import React from 'react';
import { useRouter } from 'next/router';
import { useForm, SubmitHandler } from 'react-hook-form';
import { Button, Input } from '@components';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { useAuth } from '@contexts/AuthContext';

interface SignupFormInputs {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone_number: string;
  sms_consent: boolean;
  privacy_consent: boolean;
}

const Signup: React.FC = () => {
  const router = useRouter();
  const { login } = useAuth();
  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm<SignupFormInputs>();

  const onSubmit: SubmitHandler<SignupFormInputs> = async (data) => {
    if (!data.privacy_consent) {
      toast.error('개인정보 이용에 동의해주세요.');
      return;
    }

    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/register`, {
        name: data.name,
        email: data.email,
        password: data.password,
        phone_number: data.phone_number,
        sms_consent: data.sms_consent
      });

      toast.success('회원 가입이 완료되었습니다.');
      
      // 회원가입 성공 후 자동 로그인
      await login({ email: data.email, password: data.password });
      
      router.push('/main');
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        toast.error(error.response.data.detail || '회원 가입에 실패했습니다. 다시 시도해주세요.');
      } else {
        toast.error('네트워크 오류가 발생했습니다. 다시 시도해주세요.');
      }
    }
  };

  const password = watch("password");

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold text-center mb-6">회원 가입</h1>
      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
        <Input
          label="이름"
          type="text"
          placeholder="이름을 입력해 주세요"
          error={errors.name?.message}
          disabled={isSubmitting}
          {...register("name", { 
            required: "이름을 입력해 주세요.",
            minLength: { value: 2, message: "이름은 2자 이상이어야 합니다." }
          })}
        />

        <Input
          label="이메일 주소"
          type="email"
          placeholder="이메일 주소를 입력해 주세요"
          error={errors.email?.message}
          disabled={isSubmitting}
          {...register("email", { 
            required: "이메일을 입력해 주세요.",
            pattern: {
              value: /\S+@\S+\.\S+/,
              message: "유효한 이메일 주소를 입력해 주세요."
            }
          })}
        />

       <Input
          label="비밀번호"
          type="password"
          placeholder="비밀번호를 입력해 주세요"
          error={errors.password?.message}
          disabled={isSubmitting}
          {...register("password", { 
            required: "비밀번호를 입력해 주세요.",
            minLength: { value: 8, message: "비밀번호는 8자 이상이어야 합니다." },
            validate: (value) => {
              const hasUpperCase = /[A-Z]/.test(value);
              const hasLowerCase = /[a-z]/.test(value);
              if (!hasUpperCase) {
                return "비밀번호에 대문자를 포함해야 합니다.";
              }
              if (!hasLowerCase) {
                return "비밀번호에 소문자를 포함해야 합니다.";
              }
              return true;
            }
          })}
        />

        <Input
          label="비밀번호 확인"
          type="password"
          placeholder="비밀번호를 재입력 해주세요"
          error={errors.confirmPassword?.message}
          disabled={isSubmitting}
          {...register("confirmPassword", { 
            required: "비밀번호 확인을 입력해 주세요.",
            validate: value => value === password || "비밀번호가 일치하지 않습니다."
          })}
        />

        <Input
          label="휴대 전화"
          type="tel"
          placeholder="전화번호를 입력해 주세요"
          error={errors.phone_number?.message}
          disabled={isSubmitting}
          {...register("phone_number", { 
            required: "전화번호를 입력해 주세요.",
            pattern: {
              value: /^[0-9]{10,11}$/,
              message: "유효한 전화번호를 입력해 주세요."
            }
          })}
        />

      <div className="flex items-center">
        <input
          type="checkbox"
          id="privacy_consent"
          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
          {...register("privacy_consent", { required: "개인정보 이용에 동의해 주세요." })}
        />
        <label htmlFor="privacy_consent" className="ml-2 block text-sm text-gray-900">
          (필수) 개인정보 이용에 동의합니다
        </label>
      </div>
      {errors.privacy_consent && (
        <p className="text-red-500 text-xs">{errors.privacy_consent.message}</p>
      )}

        <div className="flex items-center">
          <input
            type="checkbox"
            id="sms_consent"
            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            disabled={isSubmitting}
            {...register("sms_consent")}
          />
          <label htmlFor="sms_consent" className="ml-2 block text-sm text-gray-900">
            (선택) 혜택 SMS 수신에 동의합니다
          </label>
        </div>

        <Button
          type="submit"
          label={isSubmitting ? "처리 중..." : "회원 가입"}
          className={`w-full ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={isSubmitting}
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
        <span onClick={() => router.push('/login')} className="font-bold text-green-700 hover:text-green-800 cursor-pointer">
          로그인하기
        </span>
      </p>
    </div>
  );
};

export default Signup;