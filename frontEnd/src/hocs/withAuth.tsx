import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/authContext';
import _401_ from '@/pages/Error/401';
export default (Component: React.ComponentType, path?: string) => {
  const { state } = useAuth();
  const { token } = state;
  if (token) {
    return <Component />;
  } else {
    if (!path) {
      return <_401_ />;
    }
    return <Navigate to={path as string} />;
  }
};
