import React, { useContext } from 'react';
import { Navbar, NavbarBrand, NavbarContent, NavbarItem } from '@heroui/react';
import { FaRegMoon } from 'react-icons/fa';
import { LuSunMedium } from 'react-icons/lu';

import { ThemeContext } from '@/components/theme-provider';
import { useDispatch, useSelector } from 'react-redux';
import { logout, selectIsAuthenticated } from '@/features/user/userSlice.ts';
import { useNavigate } from 'react-router-dom';
import { Button } from '@heroui/button';
import { CiLogout } from 'react-icons/ci';

const Header = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem('token');
    navigate('/auth');
  };

  return (
    <Navbar maxWidth="xl">
      <NavbarBrand>
        <p className="font-bold text-inherit">TalksApp</p>
      </NavbarBrand>
      <NavbarContent justify="end">
        <NavbarItem
          className="lg:flex text-3xl cursor-pointer"
          onClick={toggleTheme}
        >
          {theme === 'light' ? <FaRegMoon /> : <LuSunMedium />}
        </NavbarItem>
        {isAuthenticated && (
          <NavbarItem>
            <Button
              color="default"
              variant="flat"
              className="gap-2 ml-2"
              onPress={handleLogout}
            >
              <CiLogout />
              <span>Выйти</span>
            </Button>
          </NavbarItem>
        )}
      </NavbarContent>
    </Navbar>
  );
};

export default Header;
