import React from 'react';
import { LinkComponent, ConfettiAnimation } from '@/components';
import successIcon from '@/assets/images/success.png';
import failureIcon from '@/assets/images/failure.png';
import bgImage from '@/assets/images/main-bg.png';
import { Body, Title } from '../typography';
import { CrossIcon } from '@/assets/icons';
import { useNavigate } from '@tanstack/react-router';

interface SuccessPageProps {
  text: string;
  rightAnswers?: number;
  questions?: number;
  linkUrl: string;
  linkText: string;
  setButtonClicked?: (value: boolean) => void;
  isRegistration?: boolean;
  helperText?: string;
  successThreshold?: number;
  type?: 'success' | 'failure' | 'noAccess';
  // for reload test
  exerciseId?: string;
  courseId?: string;
  categoryId?: string;
  testNumber?: number;
}

export const SuccessPage: React.FC<SuccessPageProps> = ({
  text,
  rightAnswers = 0,
  questions = 0,
  linkUrl,
  linkText,
  setButtonClicked,
  isRegistration = true,
  helperText,
  successThreshold = 0.6,
  type = 'success',
  // for reload test
  exerciseId,
  courseId,
  categoryId,
  testNumber,
}) => {
  const navigate = useNavigate();
  const scorePercentage = questions > 0 ? rightAnswers / questions : 0;
  const isTestSuccess = !isRegistration && scorePercentage >= successThreshold;

  const icons = {
    success: successIcon,
    failure: failureIcon,
    noAccess: failureIcon,
  };

  const getDisplayType = (): 'success' | 'failure' | 'noAccess' => {
    if (type) {
      return type;
    }

    if (text === 'Ошибка регистрации') {
      return 'failure';
    }

    if (!isRegistration && questions > 0) {
      return scorePercentage >= successThreshold ? 'success' : 'failure';
    }

    return 'success';
  };

  const restartTestUrl = exerciseId
    ? `/test?exercise_id=${exerciseId}&question=1&course_id=${courseId}&categoryId=${categoryId}&testNumber=${testNumber}`
    : linkUrl;

  const displayType = getDisplayType();
  const showConfetti = displayType === 'success' && isTestSuccess;

  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen"
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
      }}
    >
      {showConfetti && <ConfettiAnimation duration={5000} particleCount={60} />}

      <div className="flex flex-col items-center min-h-screen p-4 w-full">
        <div className="absolute right-5 top-[calc(5.1rem+var(--safe-top))]">
          <button
            className="cursor-pointer"
            onClick={() => navigate({ to: linkUrl })}
          >
            <CrossIcon />
          </button>
        </div>
        <div className="flex flex-col items-center justify-center flex-1">
          <img
            src={icons[displayType]}
            alt={displayType}
            className="w-40 mb-5"
          />

          <Title variant="h1" className="text-[#181717] mb-2">
            {text}
          </Title>
          {!isRegistration && rightAnswers >= 0 && (
            <Body variant="lgRegular" className="text-light">
              Ваш результат:
            </Body>
          )}
          {!isRegistration && rightAnswers >= 0 && (
            <Title variant="h9" className="text-[#0049C7]">
              {rightAnswers}/{questions}
            </Title>
          )}

          {helperText && (
            <Body className="text-center text-black">{helperText}</Body>
          )}
        </div>

        <div className="flex flex-col justify-center mb-[40px] w-full ">
          {displayType === 'noAccess' && (
            <LinkComponent
              to={linkUrl}
              className="w-full"
              variant="primary"
              onClick={() => {
                if (setButtonClicked) setButtonClicked(false);
              }}
            >
              {linkText}
            </LinkComponent>
          )}

          {displayType === 'success' && (
            <>
              <LinkComponent
                to={linkUrl}
                className="w-full mb-3"
                onClick={() => {
                  if (setButtonClicked) setButtonClicked(false);
                }}
              >
                <Title variant="h6">{linkText}</Title>
              </LinkComponent>
              {!isRegistration && rightAnswers >= 0 && (
                <LinkComponent
                  to={restartTestUrl}
                  variant="secondary"
                  className="w-full bg-[#D1D5DB]"
                  onClick={() => {
                    if (setButtonClicked) setButtonClicked(false);
                  }}
                >
                  <Title variant="h6" className="text-[#181717]">
                    Попробовать снова
                  </Title>
                </LinkComponent>
              )}
            </>
          )}

          {displayType === 'failure' && (
            <>
              <LinkComponent
                to={linkUrl}
                className="w-full mb-2"
                onClick={() => {
                  if (setButtonClicked) setButtonClicked(false);
                }}
              >
                <Title variant="h6" className="">
                  {linkText}
                </Title>
              </LinkComponent>

              <LinkComponent
                to="https://t.me/SashaPT_CEO"
                className="w-full z-20"
                variant="secondary"
                onClick={() => {
                  if (setButtonClicked) setButtonClicked(false);
                }}
              >
                <Title variant="h6" className="text-[#181717]">
                  Написать
                </Title>
              </LinkComponent>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
