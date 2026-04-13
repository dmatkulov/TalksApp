import React, { JSX } from 'react';
import { Control, useController } from 'react-hook-form';
import { Input as NextInput } from '@heroui/react';
import { Simulate } from 'react-dom/test-utils';
import invalid = Simulate.invalid;

interface Props {
  name: string;
  label: string;
  placeholder?: string;
  type?: string;
  control: Control<any>;
  required?: string;
  endContent?: JSX.Element;
}

const Input = ({
  name,
  control,
  endContent,
  placeholder,
  required,
  type,
  label,
}: Props) => {
  const {
    field,
    fieldState: { invalid },
    formState: { errors },
  } = useController({
    name,
    control,
    rules: { required },
  });
  return (
    <NextInput
      id={name}
      label={label}
      type={type}
      placeholder={placeholder}
      value={field.value}
      name={field.name}
      isInvalid={invalid}
      onChange={field.onChange}
      onBlur={field.onBlur}
      errorMessage={`${errors[name]?.message ?? ''}`}
    />
  );
};

export default Input;
