import { ReactNode } from 'react';
import { Body } from '../typography';

interface BadgeProps {
  type?: 'time' | 'rating';
  value: string | number;
  icon: ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({
  value,
  icon,
  type = 'rating',
}) => {
  const formatedValue = type === 'time' ? `${value} час` : value;

  return (
    <div className="flex items-center gap-2 text-[#181717]">
      {icon}
      <Body variant="smMedium">{formatedValue}</Body>
    </div>
  );
};
