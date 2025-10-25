import * as React from 'react';

type Props = { children: React.ReactNode; className?: string };

export function HorizontalCarousel({ children, className }: Props) {
  return (
    <div
      className={[
        'overflow-x-auto overscroll-x-contain snap-x snap-mandatory no-scrollbar carousel-gutter',
        'flex gap-4 -mx-4',
        className || '',
      ].join(' ')}
    >
      {children}
    </div>
  );
}
