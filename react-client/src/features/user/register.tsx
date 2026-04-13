import React, { useState } from 'react';
import Input from '@/components/input';
import { Link } from '@heroui/react';
import Button from '@/components/button';
import { useForm } from 'react-hook-form';
import { useRegisterMutation } from '@/app/services/userApi.ts';
import { hasErrorField } from '@/utils/has-error-field.ts';
import ErrorMessage from '@/components/error-message';

interface Register {
  email: string;
  name: string;
  password: string;
}

interface Props {
  setSelected: (value: string) => void;
}
const Register = ({ setSelected }: Props) => {
  const { handleSubmit, control } = useForm<Register>({
    mode: 'onChange',
    reValidateMode: 'onBlur',
    defaultValues: {
      email: '',
      password: '',
      name: '',
    },
  } as any);

  const [register, { isLoading }] = useRegisterMutation();
  const [error, setError] = useState('');

  const onSubmit = async (data: Register) => {
    try {
      await register(data).unwrap();
      setSelected('login');
    } catch (e) {
      if (hasErrorField(e)) {
        setError(e.data.error);
      }
    }
  };

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
      <Input
        control={control}
        name="name"
        label="Name"
        type="text"
        required="Обязательное поле"
      />
      <Input
        control={control}
        name="email"
        label="Email"
        type="email"
        required="Обязательное поле"
      />
      <Input
        control={control}
        name="password"
        label="Пароль"
        type="password"
        required="Обязательное поле"
      />

      <p className="text-center text-small">
        <ErrorMessage error={error} />
        Уже есть аккаунт?
        <br />
        <Link
          size="sm"
          className="cursor-pointer"
          onPress={() => setSelected('login')}
        >
          Войти
        </Link>
      </p>

      <Button fullWidth color="primary" type="submit" isLoading={isLoading}>
        Зарегистрироваться
      </Button>
    </form>
  );
};

export default Register;
