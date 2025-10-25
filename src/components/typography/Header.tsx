import * as React from 'react';
import { cn as clsx } from '@/libs/cn';
import { AsProp, HeaderVariant, HEADER_STYLES } from './constants';

type PolymorphicProps<T extends React.ElementType> = AsProp<T> & {
  variant?: HeaderVariant;
} & Omit<
    React.ComponentPropsWithoutRef<T>,
    keyof AsProp<T> | 'children' | 'className'
  >;

export function Header<T extends React.ElementType = 'span'>({
  as,
  variant = 'buttonBold',
  className,
  children,
  ...rest
}: PolymorphicProps<T>) {
  const Comp = (as || 'span') as React.ElementType;
  return (
    <Comp className={clsx(HEADER_STYLES[variant], className)} {...rest}>
      {children}
    </Comp>
  );
}

export default Header;
