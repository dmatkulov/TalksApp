import React, { JSX } from 'react';
import { Button as NextButton } from '@heroui/react';

interface Props extends React.PropsWithChildren {
  icon?: JSX.Element;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  fullWidth?: boolean;
  color?:
    | 'default'
    | 'primary'
    | 'secondary'
    | 'success'
    | 'warning'
    | 'danger'
    | undefined;
}

const Button = ({
  children,
  icon,
  className,
  color = 'primary',
  type,
  fullWidth,
}: Props) => {
  return (
    <NextButton
      className={className}
      color={color}
      fullWidth={fullWidth}
      size="lg"
      startContent={icon}
      type={type}
      variant="light"
    >
      {children}
    </NextButton>
  );
};

export default Button;
