import { FC, useState } from 'react';
import {
  CssBaseline,
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  Link,
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { useMessage } from '@/contexts/messageContext';

import { useAuth } from '@/contexts/authContext';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { signUp } from '@/api/user';

const SignIn: FC = () => {
  const [isSignIn, setIsSignIn] = useState(true);
  const navigate = useNavigate();
  const { control, handleSubmit, reset } = useForm();
  const { state: authState, signIn } = useAuth();
  const { dispatch: dispatchMessage } = useMessage();
  const defaultTheme = createTheme({
    palette: {
      primary: {
        main: '#45a164',
      },
    },
  });
  const defaultValues = {
    account: '',
    password: '',
    repassword: '',
  };
  const onSignInSubmit = async (val: any) => {
    const result = await signIn(val);
    if (result.code === 200) {
      dispatchMessage({
        type: 'SET_MESSAGE',
        payload: {
          type: 'success',
          content: '登录成功',
          delay: 5000,
        },
      });
      navigate('/home');
    } else {
      dispatchMessage({
        type: 'SET_MESSAGE',
        payload: {
          type: 'error',
          content: result.msg,
          delay: 5000,
        },
      });
    }
    reset(defaultValues);
  };
  const onSignUpSubmit = async (val: any) => {
    const result = await signUp(val);
    if (result.code === 200) {
      dispatchMessage({
        type: 'SET_MESSAGE',
        payload: {
          type: 'success',
          content: '注册成功',
          delay: 5000,
        },
      });
    } else {
      dispatchMessage({
        type: 'SET_MESSAGE',
        payload: {
          type: 'error',
          content: result.msg,
          delay: 5000,
        },
      });
    }
    reset(defaultValues);
  };
  const RenderSignIn = () => {
    return (
      <Box
        maxWidth="30%"
        display="flex"
        paddingLeft={8}
        borderLeft="1px solid #ccc"
        flexDirection="column"
        justifyContent="center"
        alignItems="center">
        <Typography variant="h5">登录</Typography>
        <Box sx={{ mt: 1 }}>
          <form onSubmit={handleSubmit(onSignInSubmit)}>
            <Controller
              name="account"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <TextField
                  id={field.name}
                  margin="normal"
                  fullWidth
                  label="账号"
                  {...field}
                />
              )}
            />
            <Controller
              name="password"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <TextField
                  margin="normal"
                  fullWidth
                  label="密码"
                  type="password"
                  id="password"
                  {...field}
                />
              )}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}>
              登录
            </Button>
          </form>
          <Grid container>
            <Grid item xs>
              <Link href="#" variant="body2">
                忘记密码？
              </Link>
            </Grid>
            <Grid item>
              <Link href="#" variant="body2" onClick={() => setIsSignIn(false)}>
                还没有账号？去注册
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    );
  };
  const RenderSignUp = () => {
    return (
      <Box
        maxWidth="30%"
        display="flex"
        paddingLeft={8}
        borderLeft="1px solid #ccc"
        flexDirection="column"
        justifyContent="center"
        alignItems="center">
        <Typography variant="h5">注册</Typography>
        <Box sx={{ mt: 1 }}>
          <form onSubmit={handleSubmit(onSignUpSubmit)}>
            <Controller
              name="account"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <TextField
                  id={field.name}
                  margin="normal"
                  fullWidth
                  label="账号"
                  {...field}
                />
              )}
            />
            <Controller
              name="password"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <TextField
                  margin="normal"
                  fullWidth
                  label="密码"
                  type="password"
                  id="password"
                  {...field}
                />
              )}
            />
            <Controller
              name="repassword"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <TextField
                  margin="normal"
                  fullWidth
                  label="重复密码"
                  type="password"
                  id="repassword"
                  {...field}
                />
              )}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}>
              登录
            </Button>
          </form>
          <Grid container>
            <Grid item xs>
              <Link href="#" variant="body2"></Link>
            </Grid>
            <Grid item>
              <Link href="#" variant="body2" onClick={() => setIsSignIn(true)}>
                已有账号？去登录
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    );
  };
  return (
    <ThemeProvider theme={defaultTheme}>
      <Box
        height="100vh"
        display="flex"
        justifyContent="center"
        // bgcolor="var(--primaryColor)"
        alignItems="center">
        <CssBaseline />
        <Box justifyContent="center" paddingRight={8} alignItems="center">
          <Typography variant="h1">翼信捷</Typography>
          <h1>SD-LAN控制中心</h1>
        </Box>
        {isSignIn ? <RenderSignIn /> : <RenderSignUp />}
      </Box>
    </ThemeProvider>
  );
};

export default SignIn;
