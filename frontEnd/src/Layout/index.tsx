import { FC } from 'react';
import { Outlet } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Container, Box } from '@mui/material';
import Header from './components/header';
import { useCustom } from '@/contexts/customContext';
import './index.less';
interface Props {}
const LayoutPage: FC<Props> = (props: Props) => {
  const { state } = useCustom();
  const defaultTheme = createTheme({
    //设置全局主题色
    palette: {
      primary: {
        // main: '#45a164',
        main: '#4994ec',
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
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          boxSizing: 'border-box',
          height: '100vh',
        }}>
        <Header />
        <Container
          disableGutters
          maxWidth={false}
          sx={{
            p: 3,
            boxSizing: 'border-box',
            flex: '1',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
          }}>
          <Box
            sx={{
              flex: '1 1 auto',
            }}>
            <Outlet />
          </Box>
          <footer
            style={{
              flex: '0 0 auto',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              padding: '24px',
              color: '#989898',
            }}>
            {state.copyright}
          </footer>
        </Container>
      </Box>
    </ThemeProvider>
  );
};
export default LayoutPage;
