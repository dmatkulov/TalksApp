import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { HeroUIProvider } from '@heroui/system';
import { Provider } from 'react-redux';
import { store } from '@/app/store.ts';
import { ThemeProvider } from '@/components/theme-provider';
import Auth from '@/pages/auth';
import Layout from '@/components/layout';
import Posts from '@/pages/posts';
import CurrentPost from '@/pages/current-post';
import UserProfile from '@/pages/user-profile';
import Followers from '@/pages/followers';
import Following from '@/pages/following';

import '@/styles/globals.css';
import '@/styles/index.css';
import AuthGuard from '@/features/user/authGuard.tsx';

const router = createBrowserRouter([
  {
    path: '/auth',
    element: <Auth />,
  },
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        path: '',
        element: <Posts />,
      },
      {
        path: 'posts/:id',
        element: <CurrentPost />,
      },
      {
        path: 'users/:id',
        element: <UserProfile />,
      },
      {
        path: 'followers',
        element: <Followers />,
      },
      {
        path: 'following',
        element: <Following />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <HeroUIProvider>
        <ThemeProvider>
          <AuthGuard>
            <RouterProvider router={router} />
          </AuthGuard>
        </ThemeProvider>
      </HeroUIProvider>
    </Provider>
  </React.StrictMode>,
);
