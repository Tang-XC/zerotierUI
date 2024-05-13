import { FC } from 'react';
import { Outlet } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import Joyride, { CallBackProps, STATUS, Step } from 'react-joyride';

import { Container, Box } from '@mui/material';
import Header from './components/header';
import { useAuth } from '@/contexts/authContext';
import { useCustom } from '@/contexts/customContext';
import { useStepsContext } from '@/contexts/stepContext';
import { useNavigate } from 'react-router-dom';

import './index.less';
interface Props {}
const LayoutPage: FC<Props> = (props: Props) => {
  const { state } = useCustom();
  const { state: authState } = useAuth();
  const { state: stepsState, dispatch } = useStepsContext();
  const navigate = useNavigate();
  const steps: Step[] = [
    {
      title: (
        <h3 style={{ textAlign: 'left', padding: 0, margin: 0 }}>欢迎使用</h3>
      ),
      content: (
        <p style={{ padding: 0, margin: 0, textAlign: 'left' }}>
          第一次使用 '{state.system_name}' ？点击 '开始' 进行引导程序。
        </p>
      ),
      placement: 'center',
      target: '.contentSection',
    },
    ...stepsState.steps,
  ];
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
  const handleJoyrideCallback = (data: CallBackProps) => {
    if (data.action === 'next') {
      if (data.step.data && data.step.data.path) {
        navigate(data.step.data.path);
      }
      if (data.step.target === '.step-three') {
        dispatch({
          type: 'SET_NETWORK_ADD_DIALOG',
          payload: true,
        });
      }
      dispatch({
        type: 'SET_STEP_INDEX',
        payload: data.index,
      });
    }
    if (data.action === 'skip') {
      dispatch({
        type: 'SET_SKIP',
        payload: 'true',
      });
    }
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      {authState.token && stepsState.isSkip && (
        <Joyride
          locale={{
            next: '下一步',
            skip: '不再显示',
            back: '上一步',
            last: '完成',
          }}
          steps={steps}
          continuous={true}
          showSkipButton={true} // 显示跳过按钮
          disableCloseOnEsc={true} // 按ESC关闭
          disableOverlayClose={true} // 禁用遮罩层关闭
          run={true}
          callback={handleJoyrideCallback}
        />
      )}
      <Box
        className="layout"
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
            className="contentSection"
            sx={{
              flex: '1 1 auto',
            }}>
            <TransitionGroup style={{ height: '100%', overflow: 'hidden' }}>
              <CSSTransition
                key={location.pathname}
                classNames="fade-slide"
                timeout={500}
                unmountOnExit={true}
                mountOnEnter={true}
                appear={true}
                exit={false}
                in={true}>
                <Outlet />
              </CSSTransition>
            </TransitionGroup>
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
