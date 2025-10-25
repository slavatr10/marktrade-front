import { CheckmarkIcon } from '@/assets/icons';
import IncorrectIcon from '@/assets/icons/IncorrectIcon';

export const answerIconFactory = (
  isSelected: boolean,
  isConfirmed: boolean,
  showCorrectStyle: boolean,
  showIncorrectStyle: boolean,
  className?: string
): React.JSX.Element | null => {
  if (isSelected && !isConfirmed) {
    return (
      <div className="flex items-center justify-center bg-[#0049C7] border border-[#0049C7] w-4 h-4 rounded-full">
        <CheckmarkIcon/>
      </div>
    );
  }

  if (showCorrectStyle || (isSelected && className === 'right')) {
    return <CheckmarkIcon />;
  }

  if (showIncorrectStyle || (isSelected && className === 'wrong')) {
    return <IncorrectIcon />;
  }

  return null;
};
