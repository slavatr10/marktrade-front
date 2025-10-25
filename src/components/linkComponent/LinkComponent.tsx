import { Link } from '@tanstack/react-router';
import cn from 'classnames';

interface LinkComponentProps {
  to: string;
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
  onClick?: () => void;
  variant?: 'primary' | 'secondary';
  target?: string;
}

export const LinkComponent: React.FC<LinkComponentProps> = ({
  to,
  children,
  className,
  disabled,
  onClick,
  variant = 'primary',
  target = '_self',
}) => {
  const isExternal =
    to.startsWith('http://') ||
    to.startsWith('https://') ||
    to.startsWith('mailto:') ||
    to.startsWith('tel:');

  const linkClassName = cn(
    'no-underline flex items-center justify-center text-[18px] text-white rounded-[36px] transition-colors duration-300  h-[48px]',
    className,
    {
      'bg-[#D1D5DB] text-natural-0 border-[2px] border-natural-100':
        variant === 'secondary',
      'bg-cerulean-800':
        variant === 'primary',
      'pointer-events-none bg-natural-300 text-green-950': disabled,
    }
  );

  if (isExternal) {
    return (
      <a
        href={disabled ? undefined : to}
        className={linkClassName}
        onClick={onClick}
        target={target || '_blank'}
        rel="noopener noreferrer"
      >
        {children}
      </a>
    );
  }

  return (
    <Link
      to={to}
      className={linkClassName}
      onClick={onClick}
      target={target || '_self'}
      disabled={disabled}
    >
      {children}
    </Link>
  );
};
