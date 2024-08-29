import React from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useForm, SubmitHandler } from 'react-hook-form';
import { AxiosError } from 'axios';
import { Button, Input } from '@components';
import { useAuth } from '@contexts/AuthContext';
import { toast } from 'react-toastify';

interface LoginFormInputs {
  email: string;
  password: string;
}

const Login: React.FC = () => {
  const router = useRouter();
  const { login, isAuthenticated } = useAuth();
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<LoginFormInputs>();
  const [apiError, setApiError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (isAuthenticated) {
      router.push('/main');
    }
  }, [isAuthenticated, router]);

  const onSubmit: SubmitHandler<LoginFormInputs> = async (data) => {
    try {
      setApiError(null);
      await login(data);
      toast.success('로그인 성공!');
      reset();
      router.push('/main');
    } catch (error) {
      console.error('Login error:', error);
      const err = error as AxiosError<{ detail: string }>;
      let errorMessage = '로그인에 실패했습니다. 다시 시도해주세요.';

      if (!err.response) {
        errorMessage = '네트워크 오류가 발생했습니다. 인터넷 연결을 확인하세요.';
      } else if (err.response.status === 400) {
        errorMessage = err.response.data.detail || errorMessage;
      } else if (err.response.status === 401) {
        errorMessage = '인증에 실패했습니다. 이메일과 비밀번호를 확인해주세요.';
      }

      setApiError(errorMessage);
      toast.error(errorMessage);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold text-center mb-6">로그인</h1>
      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
        {apiError && <div className="text-red-500 text-sm mb-4">{apiError}</div>}
        <Input
          {...register('email', { 
            required: '이메일을 입력해주세요.',
            pattern: {
              value: /\S+@\S+\.\S+/,
              message: '유효한 이메일 주소를 입력해주세요.'
            }
          })}
          type="email"
          placeholder="이메일"
          error={errors.email?.message}
          aria-invalid={errors.email ? "true" : "false"}
        />
        <Input
          {...register('password', { required: '비밀번호를 입력해주세요.' })}
          type="password"
          placeholder="비밀번호"
          error={errors.password?.message}
          aria-invalid={errors.password ? "true" : "false"}
        />
        <Button
          type="submit"
          label={isSubmitting ? '로그인 중...' : '로그인'}
          className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          disabled={isSubmitting}
        />
      </form>
      <div className="mt-4 text-center text-sm text-gray-600">
        <span>아직 계정이 없으신가요? </span>
        <Link href="/signup" className="font-bold text-green-700 hover:text-green-800 cursor-pointer">
          회원가입
        </Link>
      </div>
    </div>
  );
};

export default Login;