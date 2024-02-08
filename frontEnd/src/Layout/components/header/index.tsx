import { FC, useMemo, useState } from 'react';
import { AppBar, Toolbar, Typography, Link, Box, Button } from '@mui/material';
import { Avatar } from '@/components';
import { useNavigate } from 'react-router-dom';
import { routes } from '@/route/routes';

import { useAuth } from '@/contexts/authContext';
import { SvgIcon } from '@/components';
interface Props {}
const Header: FC<Props> = (props: Props) => {
  const { state: authState } = useAuth();
  const navigate = useNavigate();
  const handleNavigate = (path: string): void => {
    navigate(path);
  };
  return (
    <>
      <AppBar
        position="relative"
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
            <SvgIcon name="logo" size="50" />
            <span style={{ marginLeft: 16 }}>SD-LAN控制中心</span>
          </Typography>
          <nav>
            {routes.map((item, index) => {
              return (
                <Link
                  color="inherit"
                  underline="none"
                  key={index}
                  sx={{ my: 1, mx: 1.5, cursor: 'pointer' }}
                  onClick={() => {
                    handleNavigate(item.path);
                  }}>
                  {item.showNav?.title}
                </Link>
              );
            })}
          </nav>
          {authState.token ? (
            <Avatar name={authState.name} avatar={authState.avatar} />
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
        </Toolbar>
      </AppBar>
    </>
  );
};
export default Header;
