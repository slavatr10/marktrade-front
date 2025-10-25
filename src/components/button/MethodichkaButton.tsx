import { Link } from '@tanstack/react-router';
import cn from 'classnames';
import { Title } from '../typography';
import DocumentIcon from '@/assets/icons/DocumentIcon';

interface MethodichkaButtonProps {
  className?: string;
  href?: string | null;
}

export const MethodichkaButton = ({
  className,
  href,
}: MethodichkaButtonProps) => {
  const hasHref = !!href;
  return (
    <Link
      to={hasHref ? href : '#'}
      target="_blank"
      onClick={(e) => !hasHref && e.preventDefault()}
      className={cn(
        'flex items-center justify-center gap-2 w-full  rounded-[44px] py-3 transition-all duration-300 border border-[#D1D5DB] bg-[#F4F4F4]',
        className,
        {
          'cursor-pointer':
            hasHref,
          'opacity-50 cursor-not-allowed': !hasHref,
        }
      )}
    >
      <DocumentIcon />
      <Title variant="h6" className="text-[#181717] leading-none">
        Методичка
      </Title>
    </Link>
  );
};
