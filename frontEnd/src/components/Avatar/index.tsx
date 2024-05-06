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
  Divider,
} from '@mui/material';
import { Logout, ExpandLess, ExpandMore } from '@mui/icons-material';
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
import SettingsIcon from '@mui/icons-material/Settings';
import LockResetIcon from '@mui/icons-material/LockReset';
import { useAuth } from '@/contexts/authContext';
import { useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { resetPassword, editUser } from '@/api/user';
import { useMessage } from '@/contexts/messageContext';
import { encryptByAES } from '@/utils/encryption.js';

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
  const [isEdit, setIsEdit] = useState(false);
  const { state, signOut, getUserInfo } = useAuth();
  const { dispatch: dispatchMessage } = useMessage();
  const { control, handleSubmit, reset } = useForm({
    defaultValues: {
      old_password: '',
      new_password: '',
      account: state.account || '',
      name: state.name || '',
      email: state.email || '',
      phone: state.phone || '',
    },
  });
  const navigate = useNavigate();
  const getRoles = (roles: any) => {
    return roles.map((item: any) => item.name).join('、');
  };
  const handleSignOut = () => {
    handleClose();
    signOut();
    navigate('/home');
  };
  const handlePdReset = () => {
    handleClose();
    setIsPdReset(true);
  };
  const handleEdit = () => {
    handleClose();
    setIsEdit(true);
  };
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleResetSubmit = async (val: any) => {
    const result = await resetPassword({
      old_password: encryptByAES(val.old_password),
      new_password: encryptByAES(val.new_password),
    });
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
  };
  const handleEditSubmit = async (val: any) => {
    const result = await editUser(parseInt(state.id), {
      name: val.name,
      email: val.email,
      phone: val.phone,
      roles: state.roles.map((item) => item.id),
    });
    if (result.code === 200) {
      dispatchMessage({
        type: 'SET_MESSAGE',
        payload: {
          type: 'success',
          content: '修改成功',
          delay: 5000,
        },
      });
      getUserInfo();
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
    setIsEdit(false);
  };
  const handleCustom = () => {
    navigate('/custom');
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
            justifyContent: 'center',
            alignItems: 'center',
            minWidth: 80,
          }}>
          <Box>
            <div>{name || defaultName}</div>
            <div
              style={{
                fontSize: '12px',
              }}>
              {getRoles(state.roles)}
            </div>
          </Box>
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
        <MenuItem onClick={handleEdit}>
          <ListItemIcon>
            <DriveFileRenameOutlineIcon fontSize="small" />
          </ListItemIcon>
          修改个人信息
        </MenuItem>
        <MenuItem onClick={handlePdReset}>
          <ListItemIcon>
            <LockResetIcon fontSize="small" />
          </ListItemIcon>
          更改密码
        </MenuItem>
        <Divider />
        {state.roles.map((item) => item.id).includes(2) && (
          <MenuItem onClick={handleCustom}>
            <ListItemIcon>
              <SettingsIcon fontSize="small" />
            </ListItemIcon>
            自定义设置
          </MenuItem>
        )}
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
                  type="password"
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
                  type="password"
                  label="新密码"
                  {...field}
                />
              )}
            />
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'flex-end',
                mb: -3.1,
                mr: -1,
              }}>
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
      <Modal
        open={isEdit}
        onClose={() => setIsEdit(false)}
        sx={{
          display: 'grid',
          placeItems: 'center',
        }}>
        <Box
          sx={{
            width: '400px',
            backgroundColor: 'white',
            p: 2,
            borderRadius: 1,
          }}>
          <form onSubmit={handleSubmit(handleEditSubmit)}>
            <Controller
              name="account"
              disabled={true}
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
              name="name"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <TextField
                  id={field.name}
                  margin="normal"
                  fullWidth
                  label="用户名"
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
                  id={field.name}
                  margin="normal"
                  fullWidth
                  label="邮箱"
                  {...field}
                />
              )}
            />
            <Controller
              name="phone"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <TextField
                  id={field.name}
                  margin="normal"
                  fullWidth
                  label="手机号"
                  {...field}
                />
              )}
            />
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'flex-end',
                mb: -3.1,
                mr: -1,
              }}>
              <Button
                type="button"
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                onClick={() => setIsEdit(false)}>
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
