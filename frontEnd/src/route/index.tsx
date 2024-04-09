import { FC, useEffect } from 'react';
import { useRoutes, BrowserRouter, HashRouter } from 'react-router-dom';
import BaseAlert from '@/components/BaseAlert';
import { useMessage } from '@/contexts/messageContext';
import { useAuth } from '@/contexts/authContext';
import { useCustom } from '@/contexts/customContext';

import routes from './routes';

const Route: FC = () => {
  const routing = useRoutes(routes);
  return routing;
};
const Router: FC = () => {
  const { state } = useMessage();
  const { getUserInfo } = useAuth();
  const { getSystemInfo } = useCustom();
  useEffect(() => {
    getUserInfo();
    getSystemInfo();
  }, []);
  return (
    <HashRouter>
      <div
        style={{
          position: 'fixed',
          top: '6%',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 9999,
        }}>
        <BaseAlert {...state} isCount={false} />
      </div>
      <Route />
    </HashRouter>
  );
};
export default Router;
