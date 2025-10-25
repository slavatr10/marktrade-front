import * as React from 'react';
import { cn as clsx } from '@/libs/cn';
import { AsProp, TitleVariant, TITLE_STYLES } from './constants';

type PolymorphicProps<T extends React.ElementType> = AsProp<T> & {
  variant?: TitleVariant;
} & Omit<
    React.ComponentPropsWithoutRef<T>,
    keyof AsProp<T> | 'children' | 'className'
  >;

export function Title<T extends React.ElementType = 'h2'>({
  as,
  variant = 'h1',
  className,
  children,
  ...rest
}: PolymorphicProps<T>) {
  const Comp = (as || 'h2') as React.ElementType;
  return (
    <Comp className={clsx(TITLE_STYLES[variant], className)} {...rest}>
      {children}
    </Comp>
  );
}

export default Title;
