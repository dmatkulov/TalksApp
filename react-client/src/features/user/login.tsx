import React, {useState} from 'react';
import {useForm} from 'react-hook-form';
import Input from '@/components/input';
import {Link} from '@heroui/react';
import Button from '@/components/button';
import {useLazyCurrentQuery, useLoginMutation,} from '@/app/services/userApi.ts';
import {useNavigate} from 'react-router-dom';
import {hasErrorField} from '@/utils/has-error-field.ts';
import ErrorMessage from '@/components/error-message';

interface Props {
  setSelected: (value: string) => void;
}

type Login = {
  email: string;
  password: string;
};

const Login = ({ setSelected }: Props) => {
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<Login>({
    mode: 'onChange',
    reValidateMode: 'onBlur',
    defaultValues: {
      email: '',
      password: '',
    },
  } as any);

  const [login, { isLoading }] = useLoginMutation();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [triggerCurrentQuery] = useLazyCurrentQuery();

  const onSubmit = async (data: Login) => {
    try {
      await login(data).unwrap();
      await triggerCurrentQuery().unwrap();
      navigate('/');
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
        {<ErrorMessage error={error} />}
        Нет аккаунта?
        <br />
        <Link
          size="sm"
          className="cursor-pointer"
          onPress={() => setSelected('sign-up')}
        >
          Зарегистрируйтесь
        </Link>
      </p>
      <div className="flex gap-2 justify-end">
        <Button fullWidth color="primary" type="submit" isLoading={isLoading}>
          Войти
        </Button>
      </div>
    </form>
  );
};

export default Login;
