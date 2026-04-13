import React, { JSX } from 'react';
import { Link } from 'react-router-dom';

import Button from '@/components/button';

interface Props {
  children: React.ReactNode;
  icon: JSX.Element;
  href: string;
}
const NavButton: React.FC<Props> = ({ children, href, icon }) => {
  return (
    <Link to={href}>
      <Button className="flex justify-start text-xl" icon={icon}>
        {children}
      </Button>
    </Link>
  );
};

export default NavButton;
