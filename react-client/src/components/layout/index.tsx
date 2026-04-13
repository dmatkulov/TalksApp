import React, { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';

import Container from '../container';

import Header from '@/components/header';
import Navbar from '@/components/navbar';
import { useSelector } from 'react-redux';
import {
  selectIsAuthenticated,
  selectUser,
} from '@/features/user/userSlice.ts';
import Profile from '@/components/profile';
import NavBar from '@/components/navbar';

const Layout = () => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const user = useSelector(selectUser);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/auth');
    }
  }, []);

  return (
    <>
      <Header />
      <Container>
        <div className="flex p-4">
          <NavBar />
        </div>
        <div className="flex-1 p-4">
          <Outlet />
        </div>
        <div className="flex p-4">
          <div className="flex-col flex gap-5">{!user && <Profile />}</div>
        </div>
      </Container>
    </>
  );
};

export default Layout;
