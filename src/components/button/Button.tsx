import cn from 'classnames';
import { Title } from '../typography';

interface ButtonProps {
  title: string;
  onClick: () => void;
  className?: string;
  isGreen?: boolean;
  isDisabled?: boolean;
  isLoading?: boolean;
  styledClassName?: string;
}

export const Button = ({
  title,
  onClick,
  className,
  isGreen = false,
  isDisabled = false,
  isLoading = false,
  styledClassName,
}: ButtonProps) => {
  return (
    <button
      onClick={onClick}
      disabled={isDisabled}
      className={cn(
        'flex items-center justify-center text-[16px] leading-[16px] rounded-[44px] py-3 transition-colors duration-300',
        className,
        {
          'cursor-pointer': !isDisabled,
          'cursor-not-allowed': isDisabled,
          'bg-cerulean-800  text-natural-950 ': isGreen && !isDisabled,
          'bg-[#D1D5DB] text-[#181717]': !isGreen && !isDisabled,
          'bg-natural-300 text-green-950 border-natural-300':
            isDisabled && isGreen,
          'border-natural-500 text-natural-300': isDisabled && !isGreen,
        }
      )}
    >
      <Title variant="h6" className={cn('text-white', styledClassName)}>
        {title}
      </Title>

      {isLoading && <div className="loader-small-white"></div>}
    </button>
  );
};
