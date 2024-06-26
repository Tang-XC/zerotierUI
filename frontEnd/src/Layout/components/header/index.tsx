import { FC, useEffect, useMemo, useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Link,
  Box,
  Button,
  IconButton,
} from '@mui/material';
import { Avatar, SvgIcon } from '@/components';
import { useNavigate, useLocation } from 'react-router-dom';
import { routes } from '@/route/routes';

import { useAuth } from '@/contexts/authContext';
import classNames from 'classnames';
import { useCustom } from '@/contexts/customContext';
import BreadCrumb from '../breadCrumb';
import './index.less';
interface Props {}
const Header: FC<Props> = (props: Props) => {
  const { state: authState } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { state, getSystemInfo } = useCustom();
  const handleNavigate = (path: string): void => {
    navigate(path);
  };
  useEffect(() => {
    getSystemInfo();
  }, []);
  return (
    <>
      <AppBar
        position="relative"
        className="layout-header"
        sx={{
          zIndex: '1',
        }}>
        <Toolbar sx={{ flexWrap: 'wrap' }}>
          <Typography
            variant="h6"
            color="inherit"
            noWrap
            sx={{ flexGrow: 1 }}
            display="flex"
            alignItems="center">
            {state.logo !== 'LOGO未定义' ? (
              <img
                src={state.logo}
                style={{
                  width: '50px',
                  height: '50px',
                }}
              />
            ) : (
              <span style={{ fontSize: '24px', fontWeight: 'bold' }}>
                {state.logo}
              </span>
            )}
            <span style={{ marginLeft: 16 }}>{state.system_name}</span>
            <span style={{ margin: '0px 12px', fontSize: '32px' }}>/</span>
            <BreadCrumb />
          </Typography>
          <nav>
            {routes
              .filter((item) => {
                if (item.showNav && item.showNav.menu) {
                  if (
                    (item.showNav.auth && authState.token == '') ||
                    (authState.roles.some((role) => role.id === 1) &&
                      item.path === '/users')
                  ) {
                    return false;
                  }
                  return true;
                } else {
                  return false;
                }
              })
              .map((item, index) => {
                return (
                  <Link
                    color="inherit"
                    underline="none"
                    key={index}
                    sx={{
                      my: 1,
                      mx: 1,
                      cursor: 'pointer',
                      padding: '4px 8px',
                      borderRadius: '10px',
                      boxSizing: 'border-box',
                    }}
                    className={classNames({
                      activeMenuItem: location.pathname === item.path,
                      'step-one': item.path === '/network',
                    })}
                    onClick={() => {
                      handleNavigate(item.path);
                    }}>
                    {item.showNav?.title}
                  </Link>
                );
              })}
          </nav>
          {authState.token ? (
            <Avatar
              name={authState.name || authState.account}
              avatar={authState.avatar}
            />
          ) : (
            <Box sx={{ ml: 1 }}>
              <Button
                variant="outlined"
                color="inherit"
                onClick={() => handleNavigate('/auth')}>
                登录
              </Button>
            </Box>
          )}
          <Box sx={{ fontSize: '0px' }}>
            <IconButton
              sx={{ mr: -1 }}
              onClick={() => {
                window.open('https://docs.yyds.fr/');
              }}>
              <SvgIcon name="help" color="white" size="24px" />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
    </>
  );
};
export default Header;
