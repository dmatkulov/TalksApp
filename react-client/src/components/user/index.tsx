import React from 'react';
import { User as HeroUiUser } from '@heroui/react';
import { BASE_URL } from '@/constants.ts';

interface Props {
  name: string;
  avatarUrl: string;
  description?: string;
  className?: string;
}
const User = ({
  name = '',
  avatarUrl = '',
  description = '',
  className = '',
}: Props) => {
  return (
    <HeroUiUser
      name={name}
      className={className}
      description={description}
      avatarProps={{ src: `${BASE_URL}${avatarUrl}` }}
    ></HeroUiUser>
  );
};

export default User;
