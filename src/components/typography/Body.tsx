import * as React from 'react';
import { cn as clsx } from '@/libs/cn';
import { AsProp, BodyVariant, BODY_STYLES } from './constants';

type PolymorphicProps<T extends React.ElementType> = AsProp<T> & {
  variant?: BodyVariant;
} & Omit<
    React.ComponentPropsWithoutRef<T>,
    keyof AsProp<T> | 'children' | 'className'
  >;

export function Body<T extends React.ElementType = 'p'>({
  as,
  variant = 'mdRegular',
  className,
  children,
  ...rest
}: PolymorphicProps<T>) {
  const Comp = (as || 'p') as React.ElementType;
  return (
    <Comp className={clsx(BODY_STYLES[variant], className)} {...rest}>
      {children}
    </Comp>
  );
}

export default Body;
