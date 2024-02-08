import { FC } from 'react';
import { Outlet } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Container } from '@mui/material';
import Header from './components/header';

import './index.less';
interface Props {}
const LayoutPage: FC<Props> = (props: Props) => {
  const defaultTheme = createTheme({
    //设置全局主题色
    palette: {
      primary: {
        main: '#45a164',
      },
    },
    components: {
      MuiListItemButton: {
        styleOverrides: {
          root: {
            '&.Mui-selected': {
              backgroundColor: 'var(--selectedBgColor)!important',
              color: 'var(--selectedTextColor)!important',
            },
            '&:hover': {
              backgroundColor: 'var(--hoverBgColor)',
            },
          },
        },
      },
    },
  });
  return (
    <ThemeProvider theme={defaultTheme}>
      <Header />
      <Container disableGutters maxWidth={false} sx={{ p: 3 }}>
        <Outlet />
      </Container>
    </ThemeProvider>
  );
};
export default LayoutPage;
