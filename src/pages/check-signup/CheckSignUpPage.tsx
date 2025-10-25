import React from 'react';
import { useState } from 'react';
import { SuccessPage } from '@/components';

const CheckSignUpPage: React.FC = () => {
  const [inputValue, setInputValue] = useState<string>('');
  const [registerSuccess, setRegisterSuccess] = useState<boolean>(false);

  if (registerSuccess) {
    return (
      <SuccessPage
        text="Регистрация успешна"
        linkUrl="/materials"
        linkText="Продолжить"
      />
    );
  }

  return (
    <div className="flex flex-col items-center justify-center p-4 bg-white rounded shadow-md">
      <div className="flex flex-col items-center">
        <h1 className="text-2xl font-bold mb-4">
          Укажите свой аккаунт ID для проверки регистрации
        </h1>
        <input
          className="border border-gray-300 rounded p-2 mb-4"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
        <button
          className="flex items-center justify-center bg-blue-500 text-white px-4 py-2 rounded"
          onClick={() => setRegisterSuccess(true)}
        >
          Проверить
          <svg
            width="9"
            height="14"
            viewBox="0 0 9 14"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="ml-2"
          >
            <path d="M1 1L7 7L1 13" stroke="white" strokeWidth="1.5" />
          </svg>
        </button>
        <p className="mt-4">
          Вот дополнительная инструкция, как найти аккаунт ID
        </p>
      </div>
    </div>
  );
};

export default CheckSignUpPage;
