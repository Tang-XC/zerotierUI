import React, { Suspense, FC, lazy } from 'react';
import { CircularProgress } from '@mui/material';
import { Navigate } from 'react-router-dom';
export interface RouteItem {
  path: string;
  element: JSX.Element;
  children?: RouteItem[];
  showNav?: {
    title: string;
    icon?: string;
  };
}
export const lazyLoad = (Comp: FC<any>) => {
  return (
    <Suspense fallback={<CircularProgress />}>
      <Comp />
    </Suspense>
  );
};
export const routes = [
  {
    path: '',
    element: <Navigate to="/home" replace={true} />,
  },
  {
    path: '/home',
    element: lazyLoad(React.lazy(() => import('@/pages/home'))),
    showNav: {
      title: '首页',
      icon: 'home',
      menu: true,
    },
  },
  {
    path: '/users',
    element: lazyLoad(React.lazy(() => import('@/pages/users'))),
    showNav: {
      title: '用户列表',
      auth: true,
      icon: 'user',
      menu: true,
    },
  },
  {
    path: '/network',
    element: lazyLoad(React.lazy(() => import('@/pages/network/index'))),
    showNav: {
      title: '网络列表',
      auth: true,
      icon: 'network',
      menu: true,
    },
    children: [
      {
        path: '',
        element: lazyLoad(
          React.lazy(() => import('@/pages/network/index/index'))
        ),
      },
      {
        path: 'detail',
        element: lazyLoad(React.lazy(() => import('@/pages/network/detail'))),
        showNav: {
          title: '网络详情',
        },
      },
    ],
  },
  {
    path: '/custom',
    element: lazyLoad(React.lazy(() => import('@/pages/custom'))),
    showNav: {
      title: '自定义设置',
      menu: false,
    },
  },
];
export default [
  {
    path: '/',
    element: lazyLoad(React.lazy(() => import('@/Layout'))),
    children: routes,
  },
  {
    path: '/auth',
    element: lazyLoad(React.lazy(() => import('@/pages/auth'))),
  },
  {
    path: '*',
    element: lazyLoad(React.lazy(() => import('@/pages/Error/404'))),
  },
];
