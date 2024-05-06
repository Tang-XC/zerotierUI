import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/authContext';
import _401_ from '@/pages/Error/401';
export default (
  Component: React.ComponentType,
  path?: string,
  roles?: number[]
) => {
  const { state } = useAuth();
  const { token } = state;
  if (token) {
    if (roles && roles.length > 0) {
      let flag = state.roles.some((item) => roles.includes(item.id));
      if (!flag) {
        return <_401_ />;
      }
    }
    return <Component />;
  } else {
    if (!path) {
      return <_401_ />;
    }
    return <Navigate to={path as string} />;
  }
};
