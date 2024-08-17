import React, { useReducer, useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import axios, { AxiosError } from 'axios';
import { Button, Input } from '@components';

interface State {
  email: string;
  password: string;
  error: string;
}

type Action =
  | { type: 'SET_EMAIL'; payload: string }
  | { type: 'SET_PASSWORD'; payload: string }
  | { type: 'SET_ERROR'; payload: string };

const initialState: State = {
  email: '',
  password: '',
  error: '',
};

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'SET_EMAIL':
      return { ...state, email: action.payload };
    case 'SET_PASSWORD':
      return { ...state, password: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    default:
      return state;
  }
};

const login = async (email: string, password: string) => {
  const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/login`, { email, password });
  const { access_token } = response.data;
  localStorage.setItem('accessToken', access_token);
  return response.data;
};

const Login: React.FC = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // 로그인 상태 확인 및 리다이렉션
  useEffect(() => {
    const isLoggedIn = sessionStorage.getItem('isLoggedIn');
    if (isLoggedIn === 'true') {
      router.push('/main');
    }
  }, [router]);

  const handleSubmit = async () => {
    try {
      const user = await login(state.email, state.password);
      alert('로그인 성공!');
      
      // JWT 저장
      if (user.access_token) {
        localStorage.setItem('accessToken', user.access_token);
      }
      
      sessionStorage.setItem('isLoggedIn', 'true');
      sessionStorage.setItem('userRole', user.role);
      
      // 리다이렉션 URL 처리
      const redirectUrl = router.query.redirect || '/main';
      router.push(redirectUrl as string);
    } catch (error) {
      const err = error as AxiosError<{ detail: string }>;
      let errorMessage = '로그인에 실패했습니다. 다시 시도해주세요.';
      
      // 에러 종류에 따른 메시지 구분
      if (!err.response) {
        errorMessage = '네트워크 오류가 발생했습니다. 인터넷 연결을 확인하세요.';
      } else if (err.response.status === 400) {
        errorMessage = err.response.data.detail || errorMessage;
      }
      
      dispatch({
        type: 'SET_ERROR',
        payload: errorMessage,
      });
      dispatch({ type: 'SET_PASSWORD', payload: '' });
    }
  };

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    await handleSubmit();
    setLoading(false);
  };

  return (
    <div className="max-w-sm mx-auto p-5 bg-green-100 rounded border border-gray-300">
      <h1 className="text-center text-gray-800 mb-5 font-bold">로그인</h1>
      <form className="flex flex-col gap-4" onSubmit={handleFormSubmit}>
        <Input
          name="email"
          type="email"
          placeholder="이메일"
          value={state.email}
          onChange={(e) => dispatch({ type: 'SET_EMAIL', payload: e.target.value })}
          className="p-2 border border-gray-300 rounded"
        />
        <Input
          name="password"
          type="password"
          placeholder="비밀번호"
          value={state.password}
          onChange={(e) => dispatch({ type: 'SET_PASSWORD', payload: e.target.value })}
          className="p-2 border border-gray-300 rounded"
        />
        <Button
          type="submit"
          label="로그인"
          className="bg-white text-gray-800 border border-gray-800 p-2 rounded hover:bg-gray-200 transition"
        />
      </form>
      {loading && <div className="text-center text-gray-600">Loading...</div>}
      {state.error && <div className="text-red-600 text-sm mt-2">{state.error}</div>}
      <div className="text-center mt-4">
        <span>아직 계정이 없으신가요? </span>
        <Link href="/signup" className="underline cursor-pointer text-blue-500">회원가입</Link>
      </div>
    </div>
  );
};

export default Login;