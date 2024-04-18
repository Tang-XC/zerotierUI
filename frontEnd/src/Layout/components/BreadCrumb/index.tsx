import { FC, useEffect } from 'react';
import { Box } from '@mui/material';
import { useLocation } from 'react-router-dom';
import routes from '@/route/routes';

const BreadCrumb: FC = () => {
  const location = useLocation();
  const getBreadcrumb = (path: string): Array<string> => {
    const breadcrumb: Array<string> = [];
    const paths = path.slice(1).split('/');
    const getBreadcrumbName = (routes: any[], path: string) => {
      routes.forEach((route) => {
        const routePath = route.path.replace('/', '');
        if (routePath === path) {
          breadcrumb.push(route.showNav?.title);
          return;
        } else if (route.children) {
          getBreadcrumbName(route.children, path);
          return;
        }
      });
    };
    paths.forEach((item) => {
      getBreadcrumbName(routes, item);
    });
    return breadcrumb;
  };
  useEffect(() => {
    getBreadcrumb(location.pathname);
  }, [location]);
  return (
    <Box
      sx={{
        opacity: 0.8,
        //斜体
        fontStyle: 'italic',
        fontSize: '16px',
        m: 0,
        p: 0,
      }}>
      <ul style={{ listStyle: 'none', display: 'flex', margin: 0, padding: 0 }}>
        {getBreadcrumb(location.pathname).map((item, index) => (
          <li key={index}>
            {item}{' '}
            {index < getBreadcrumb(location.pathname).length - 1 && (
              <span
                style={{
                  margin: '0 8px',
                  fontStyle: 'normal',
                }}>
                /
              </span>
            )}
          </li>
        ))}
      </ul>
    </Box>
  );
};

export default BreadCrumb;
