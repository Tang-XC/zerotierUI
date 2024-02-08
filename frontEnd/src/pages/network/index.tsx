import { FC } from 'react';
import { Outlet } from 'react-router-dom';
import withAuth from '@/hocs/withAuth';

const Networks: FC = () => {
  return <Outlet />;
};
export default () => withAuth(Networks);
