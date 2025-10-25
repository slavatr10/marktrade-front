import React from 'react';
import cn from 'classnames';
import { Answer as AnswerType } from '@/types';
import { answerIconFactory } from '@/utils';
import { Body } from '../typography';

interface AnswerProps {
  index: number;
  answer: AnswerType;
  setAnswer: (answer: AnswerType) => void;
  selectedAnswer: AnswerType | null;
  className?: string;
  rightAnswer: AnswerType | null;
  disabled?: boolean;
  isConfirmed?: boolean;
}

export const Answer: React.FC<AnswerProps> = ({
  index,
  answer,
  setAnswer,
  selectedAnswer,
  className,
  rightAnswer,
  disabled,
  isConfirmed = false,
}) => {
  const isSelected = Boolean(
    selectedAnswer && answer.value === selectedAnswer.value
  );
  const isCorrectAnswer = Boolean(
    rightAnswer && answer.value === rightAnswer.value
  );

  const showCorrectStyle = Boolean(isConfirmed && isCorrectAnswer);
  const showIncorrectStyle = Boolean(
    isConfirmed && isSelected && !isCorrectAnswer
  );
  const letterPrefix = String.fromCharCode(65 + index);

  return (
    <button
      className={cn(
        'w-full flex items-center justify-between px-4 py-3 rounded-[16px]',
        {
          'bg-white': !isSelected,
          'bg-[#E3E8F3] border-[2px] border-[#0049C7]': isSelected,

          'border border-[2px] !border-[#2ECC71] !bg-[#D5F5E3]':
            showCorrectStyle || className === 'right',
          'border-[#E74C3C] bg-[#FADBD8]':
            showIncorrectStyle || className === 'wrong',
          'border-[#0049C7]': isSelected && !isConfirmed,
          'border-natural-800':
            !isSelected &&
            !showCorrectStyle &&
            !showIncorrectStyle &&
            className !== 'right' &&
            className !== 'wrong',
        },
        className
      )}
      style={{ boxShadow: '0 4px 4px rgba(44,52,80,0.05)' }}
      onClick={() => !disabled && setAnswer(answer)}
      disabled={disabled}
    >
      <Body
        variant="smRegular"
        className="text-left text-[#181717] max-w-[90%]"
      >
        {letterPrefix}. {answer.value}
      </Body>
      <div
        className={cn(
          'w-[18px] h-[18px] rounded-full flex items-center justify-center border-[1.5px] border-[#B0B3B8]',
          {
            'border-[B0B3B8]': !isSelected && !showCorrectStyle,
            '!border-[#0049C7]': isSelected && !isConfirmed,
            '!border-[#2ECC71] bg-[#2ECC71]':
              showCorrectStyle || (isSelected && className === 'right'),
            'border-[#E74C3C] bg-[#E74C3C]':
              showIncorrectStyle || (isSelected && className === 'wrong'),
          }
        )}
      >
        {answerIconFactory(
          isSelected,
          isConfirmed,
          showCorrectStyle,
          showIncorrectStyle,
          className
        )}
      </div>
    </button>
  );
};
