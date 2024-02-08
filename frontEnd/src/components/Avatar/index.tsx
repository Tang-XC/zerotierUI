import { FC, useState } from 'react';
import {
  Avatar as MuiAvatar,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  Box,
  Modal,
  TextField,
  Button,
} from '@mui/material';
import {
  CoPresent,
  Settings,
  Logout,
  ExpandLess,
  ExpandMore,
} from '@mui/icons-material';
import LockResetIcon from '@mui/icons-material/LockReset';
import { useAuth } from '@/contexts/authContext';
import { useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { resetPassword } from '@/api/user';
import { useMessage } from '@/contexts/messageContext';

interface Props {
  name?: string;
  avatar?: string;
}
const defaultName: string = '未设置用户名';
const defaultAvatar: string = '/avatar.jpeg';
const Avatar: FC<Props> = (props) => {
  const { name = defaultName, avatar = defaultAvatar } = props;

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const [isPdReset, setIsPdReset] = useState(false);

  const { signOut } = useAuth();
  const { dispatch: dispatchMessage } = useMessage();
  const { control, handleSubmit, reset } = useForm({
    defaultValues: {
      old_password: '',
      new_password: '',
    },
  });

  const navigate = useNavigate();
  const handleSignOut = () => {
    handleClose();
    signOut();
    navigate('/home');
  };
  const handlePdReset = () => {
    handleClose();
    setIsPdReset(true);
  };
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleResetSubmit = async (val: any) => {
    const result = await resetPassword(val);
    if (result.code === 200) {
      setIsPdReset(false);
    }
    if (result.code === 200) {
      dispatchMessage({
        type: 'SET_MESSAGE',
        payload: {
          type: 'success',
          content: '密码修改成功',
          delay: 5000,
        },
      });
      reset({
        old_password: '',
        new_password: '',
      });
    }
  };
  return (
    <div className="avatar-wrap d-flex">
      <IconButton
        onClick={handleClick}
        size="small"
        aria-controls={open ? 'account-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}>
        <MuiAvatar
          sx={{ width: '50px', height: '50px' }}
          src={avatar || defaultAvatar}
        />
        <Box
          sx={{
            ml: 1,
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
          }}>
          {name || defaultName}
          {open ? <ExpandLess /> : <ExpandMore />}
        </Box>
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
            mt: 1.5,
            '& .MuiAvatar-root': {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            '&::before': {
              content: '""',
              display: 'block',
              position: 'absolute',
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: 'background.paper',
              transform: 'translateY(-50%) rotate(45deg)',
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}>
        <MenuItem onClick={handlePdReset}>
          <ListItemIcon>
            <LockResetIcon fontSize="small" />
          </ListItemIcon>
          更改密码
        </MenuItem>
        <MenuItem onClick={handleSignOut}>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          退出登录
        </MenuItem>
      </Menu>
      <Modal
        open={isPdReset}
        onClose={() => setIsPdReset(false)}
        sx={{
          display: 'grid',
          placeItems: 'center',
        }}>
        <Box
          sx={{
            backgroundColor: 'white',
            p: 2,
            borderRadius: 1,
          }}>
          <form onSubmit={handleSubmit(handleResetSubmit)}>
            <Controller
              name="old_password"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <TextField
                  id={field.name}
                  margin="normal"
                  fullWidth
                  label="旧密码"
                  {...field}
                />
              )}
            />
            <Controller
              name="new_password"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <TextField
                  id={field.name}
                  margin="normal"
                  fullWidth
                  label="新密码"
                  {...field}
                />
              )}
            />
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                type="button"
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                onClick={() => setIsPdReset(false)}>
                取消
              </Button>
              <Button
                type="submit"
                variant="contained"
                sx={{ mt: 3, mb: 2, ml: 1 }}>
                确定
              </Button>
            </Box>
          </form>
        </Box>
      </Modal>
    </div>
  );
};
export default Avatar;
