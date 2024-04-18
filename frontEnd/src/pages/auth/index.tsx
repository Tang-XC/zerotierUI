import { FC, useEffect, useState } from 'react';
import {
  CssBaseline,
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  Link,
  Checkbox,
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { useMessage } from '@/contexts/messageContext';

import { useAuth } from '@/contexts/authContext';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { useCustom } from '@/contexts/customContext';
import { ZTDialog } from '@/components';

import { signUp, forgetPassword } from '@/api/user';
import { getSystem } from '@/api/system';
import { encryptByAES } from '@/utils/encryption.js';

const SignIn: FC = () => {
  const [isSignIn, setIsSignIn] = useState(0);
  const [isProtocol, setIsProtocol] = useState(false);
  const [agreeProtocol, setAgreeProtocol] = useState(false);
  const [protocol, setProtocol] = useState<any>('');
  const navigate = useNavigate();
  const { control, handleSubmit, reset } = useForm();
  const { state: authState, signIn } = useAuth();
  const { dispatch: dispatchMessage } = useMessage();
  const { state } = useCustom();

  const defaultTheme = createTheme({
    palette: {
      primary: {
        // main: '#45a164',
        main: '#4994ec',
      },
    },
  });
  const defaultValues = {
    account: '',
    password: '',
    repassword: '',
  };
  const onSignInSubmit = async (val: any) => {
    const result = await signIn({
      account: encryptByAES(val.account),
      password: encryptByAES(val.password),
    });
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
    const result = await signUp({
      account: encryptByAES(val.account),
      password: encryptByAES(val.password),
    });
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
  const onForgetPdSubmit = async (val: any) => {
    const result = await forgetPassword({
      account: val.account,
      email: val.email,
    });
    if (result.code === 200) {
      dispatchMessage({
        type: 'SET_MESSAGE',
        payload: {
          type: 'success',
          content: result.data,
          delay: 5000,
        },
      });
      setIsSignIn(0);
      reset(defaultValues);
    }
  };
  const getProtocolInfo = async () => {
    const result = await getSystem();
    if (result.code === 200) {
      setProtocol(result.data.protocol_info);
    }
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
            <Box sx={{ display: 'flex', alignItems: 'center', mb: -2, ml: -1 }}>
              <Checkbox
                checked={agreeProtocol}
                onChange={(val) => setAgreeProtocol(val.target.checked)}
              />
              <Typography>
                我已阅读并同意 《
                <a
                  style={{ color: '#5c92e9', cursor: 'pointer' }}
                  onClick={() => setIsProtocol(true)}>
                  用户协议
                </a>
                》
              </Typography>
            </Box>
            <Button
              disabled={!agreeProtocol}
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}>
              登录
            </Button>
          </form>
          <Grid container>
            <Grid item xs>
              <Link
                variant="body2"
                sx={{
                  cursor: 'pointer',
                }}
                onClick={() => {
                  setIsSignIn(2);
                  reset(defaultValues);
                }}>
                忘记密码？
              </Link>
            </Grid>
            <Grid item>
              <Link
                sx={{
                  cursor: 'pointer',
                }}
                variant="body2"
                onClick={() => {
                  setIsSignIn(1);
                  reset(defaultValues);
                  setAgreeProtocol(false);
                }}>
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
            <Box sx={{ display: 'flex', alignItems: 'center', mb: -2, ml: -1 }}>
              <Checkbox
                checked={agreeProtocol}
                onChange={(val) => setAgreeProtocol(val.target.checked)}
              />
              <Typography>
                我已阅读并同意 《
                <a
                  style={{ color: '#5c92e9', cursor: 'pointer' }}
                  onClick={() => setIsProtocol(true)}>
                  用户协议
                </a>
                》
              </Typography>
            </Box>
            <Button
              disabled={!agreeProtocol}
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}>
              提交
            </Button>
          </form>
          <Grid container>
            <Grid item xs>
              <Link variant="body2"></Link>
            </Grid>
            <Grid item>
              <Link
                sx={{
                  cursor: 'pointer',
                }}
                variant="body2"
                onClick={() => {
                  setIsSignIn(0);
                  reset(defaultValues);
                  setAgreeProtocol(false);
                }}>
                已有账号？去登录
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    );
  };
  const RenderForgetPd = () => {
    return (
      <Box
        maxWidth="30%"
        display="flex"
        paddingLeft={8}
        borderLeft="1px solid #ccc"
        flexDirection="column"
        justifyContent="center"
        alignItems="center">
        <Typography variant="h5">找回密码</Typography>
        <Box sx={{ mt: 1 }}>
          <form onSubmit={handleSubmit(onForgetPdSubmit)}>
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
              name="email"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <TextField
                  margin="normal"
                  fullWidth
                  label="邮箱"
                  type="email"
                  id="email"
                  {...field}
                />
              )}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}>
              提交
            </Button>
          </form>
          <Grid container>
            <Grid item xs>
              <Link variant="body2"></Link>
            </Grid>
            <Grid item>
              <Link
                sx={{
                  cursor: 'pointer',
                }}
                variant="body2"
                onClick={() => {
                  setIsSignIn(0);
                  reset(defaultValues);
                  setAgreeProtocol(false);
                }}>
                返回
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    );
  };
  useEffect(() => {
    if (isProtocol) {
      getProtocolInfo();
    }
  }, [isProtocol]);
  return (
    <ThemeProvider theme={defaultTheme}>
      <Box
        height="100%"
        display="flex"
        justifyContent="center"
        // bgcolor="var(--primaryColor)"
        alignItems="center">
        <CssBaseline />
        <Box justifyContent="center" paddingRight={8} alignItems="center">
          <Typography variant="h1">{state.system_name}</Typography>
          <h1>{state.slogan}</h1>
        </Box>
        {isSignIn === 0 && <RenderSignIn />}
        {isSignIn === 1 && <RenderSignUp />}
        {isSignIn === 2 && <RenderForgetPd />}
      </Box>
      <ZTDialog title="用户协议" open={isProtocol} isFooter={false}>
        <Box
          sx={{
            // textIndent: 24,
            wordBreak: 'break-all',
            whiteSpace: 'pre-wrap',
          }}>
          {protocol}
        </Box>
        <Button
          onClick={() => setIsProtocol(false)}
          sx={{
            float: 'right',
            mb: -1.5,
            mr: -2,
          }}
          variant="contained">
          确定
        </Button>
      </ZTDialog>
    </ThemeProvider>
  );
};

export default SignIn;
