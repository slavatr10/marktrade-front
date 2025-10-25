import React from 'react';
import { SuccessPage } from '@/components';
import { useTelegramAuth } from '@/hooks/useTelegramAuth';
import StartPage from '../start/StartPage';

const HomePage: React.FC = () => {
  const { status, resetNoAccess } = useTelegramAuth();

  if (status === 'no-access') {
    return (
      <SuccessPage
        type="noAccess"
        text="У Вас нет доступа"
        linkUrl="https://t.me/SashaPT_CEO"
        linkText="Написать"
        helperText="напишите нам, чтобы получить доступ к приложению"
        setButtonClicked={resetNoAccess}
      />
    );
  }

  return <StartPage />;
};

export default HomePage;
