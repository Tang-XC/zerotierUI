import { FC, useState, useMemo, useRef, useEffect } from 'react';
import {
  Divider,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Tooltip,
  MenuItem,
  Grid,
  Popover,
  Typography,
  IconButton,
} from '@mui/material';
import { ZTTable } from '@/components';
import { useForm, Controller } from 'react-hook-form';
import withAuth from '@/hocs/withAuth';
import {
  getAllUsers,
  getRoles,
  deleteUser,
  createUser,
  editUser,
  changePassword,
} from '@/api/user';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import LockResetIcon from '@mui/icons-material/LockReset';
import InfoIcon from '@mui/icons-material/Info';
import { useMessage } from '@/contexts/messageContext';
import { useAuth } from '@/contexts/authContext';
import { encryptByAES } from '@/utils/encryption.js';

const Users: FC = () => {
  const [open, setOpen] = useState(false);
  const [actionType, setActionType] = useState(0);
  const form = useRef<HTMLFormElement>(null);
  const actionRef = useRef<any>(null);
  const [currentId, setCurrentId] = useState<number>(0);
  const [popConfirm, setPopConfirm] = useState(false);
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [rolesOptions, setRolesOptions] = useState<any[]>([]);
  const defaultValues = {
    account: '',
    password: '',
    name: '',
    email: '',
    phone: '',
    roles: [],
  };
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ defaultValues: defaultValues });
  const { dispatch: dispatchMessage } = useMessage();
  const { state } = useAuth();

  const columns = useMemo(() => {
    let arrs = [
      {
        title: '用户名',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: '账号',
        dataIndex: 'account',
        key: 'account',
      },
      {
        title: '邮箱',
        dataIndex: 'email',
        key: 'email',
      },
      {
        title: '手机号',
        dataIndex: 'phone',
        key: 'phone',
      },

      {
        title: '角色',
        dataIndex: 'roles',
        key: 'roles',
        render: (text: any) => text.map((item: any) => item.name).join('、'),
      },
      {
        title: '',
        dataIndex: 'action',
        key: 'action',
        render: (text: any, record: any) => (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-around',
              alignItems: 'center',
              width: '100px',
              height: '100%',
              color: 'primary.main',
            }}>
            <Tooltip title="编辑">
              <IconButton
                type="button"
                disabled={!state.permissions.includes('user-edit')}
                onClick={() => {
                  onEdit(record);
                  setCurrentId(record.id);
                }}>
                <EditIcon
                  sx={{
                    cursor: 'pointer',
                    color: state.permissions.includes('user-edit')
                      ? 'primary.main'
                      : 'action.disabled',
                  }}
                />
              </IconButton>
            </Tooltip>
            <Divider orientation="vertical" flexItem />
            <Tooltip title="重置密码">
              <IconButton
                type="button"
                disabled={!state.permissions.includes('user-pdReset')}
                onClick={() => {
                  setCurrentId(record.id);
                  setActionType(2);
                  setOpen(true);
                }}>
                <LockResetIcon
                  sx={{
                    cursor: 'pointer',
                    color: state.permissions.includes('user-pdReset')
                      ? 'primary.main'
                      : 'action.disabled',
                  }}
                />
              </IconButton>
            </Tooltip>
            <Divider orientation="vertical" flexItem />
            <Tooltip title="删除">
              <IconButton
                type="button"
                disabled={
                  !state.permissions.includes('user-del') ||
                  state.account === record.account
                }
                onClick={(event) => {
                  setCurrentId(record.id);
                  setAnchorEl(event.currentTarget);
                  setPopConfirm(true);
                }}>
                <DeleteIcon
                  sx={{
                    cursor: 'pointer',
                    color:
                      !state.permissions.includes('user-del') ||
                      state.account === record.account
                        ? 'action.disabled'
                        : 'error.main',
                  }}
                />
              </IconButton>
            </Tooltip>
          </Box>
        ),
      },
    ];
    if (
      !['user-add', 'user-edit', 'user-del', 'user-pdReset'].every((item) => {
        return state.permissions.includes(item);
      })
    ) {
      arrs = arrs.filter((item) => item.dataIndex != 'action');
    }
    return arrs;
  }, [state]);
  const fieldProps = {
    margin: 'normal',
    fullWidth: true,
    // variant: 'standard',
  };
  const getRolesOptions = async () => {
    const result = await getRoles();
    if (result.code === 200) {
      setRolesOptions(result.data);
    }
  };
  const getData = async (params: any) => {
    const result = await getAllUsers(params);
    if (result.code === 200) {
      return {
        data: result.data,
      };
    }
    return {
      data: [],
    };
  };
  const onCreate = () => {
    setOpen(true);
    reset(defaultValues);
  };
  const onSubmit = async (val: any) => {
    if (actionType === 0) {
      const result = await createUser({
        ...val,
        roles: [val.roles],
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
        actionRef.current?.reload();
        setOpen(false);
      }
    } else if (actionType === 1) {
      const result = await editUser(currentId, {
        ...val,
        roles: val.roles instanceof Array ? val.roles : [val.roles],
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
        actionRef.current?.reload();
        setOpen(false);
      }
    } else if (actionType === 2) {
      const result = await changePassword(currentId, {
        new_password: encryptByAES(val.password),
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
        actionRef.current?.reload();
        setOpen(false);
      }
    }
  };
  const onEdit = (record: any) => {
    setActionType(1);
    setOpen(true);
    reset({
      ...record,
      roles: record.roles.map((item: any) => item.id),
    });
  };
  const onDelete = async (id: number) => {
    const result = await deleteUser(id);
    if (result.code === 200) {
      dispatchMessage({
        type: 'SET_MESSAGE',
        payload: {
          type: 'success',
          content: result.data,
          delay: 5000,
        },
      });
      actionRef.current?.reload();
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
  useEffect(() => {
    getRolesOptions();
  }, []);
  return (
    <>
      <ZTTable
        actionRef={actionRef}
        columns={columns}
        request={getData}
        onCreate={onCreate}
        searchMode="simple"
      />
      <Dialog open={open} onClose={() => setOpen(false)} scroll="paper">
        <DialogTitle>{actionType === 0 ? '添加' : '编辑'}</DialogTitle>
        <DialogContent
          sx={{
            width: '500px',
          }}>
          <form ref={form} onSubmit={handleSubmit(onSubmit)}>
            <Grid container columnSpacing={1}>
              {[0, 1].includes(actionType) && (
                <>
                  <Grid item xs={12}>
                    <Controller
                      name="account"
                      control={control}
                      rules={{ required: true }}
                      render={({ field }) => (
                        <TextField
                          id={field.name}
                          label="账号"
                          required
                          error={!!errors.account}
                          helperText={errors.account ? '账号不能为空' : null}
                          {...(fieldProps as any)}
                          {...field}
                        />
                      )}
                    />
                  </Grid>
                </>
              )}
              {[2].includes(actionType) && (
                <Grid item xs={12}>
                  <Controller
                    name="password"
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => (
                      <TextField
                        id={field.name}
                        label="密码"
                        required
                        type="password"
                        error={!!errors.password}
                        helperText={errors.password ? '密码不能为空' : null}
                        {...(fieldProps as any)}
                        {...field}
                      />
                    )}
                  />
                </Grid>
              )}
              {[0, 1].includes(actionType) && (
                <>
                  <Grid item xs={6}>
                    <Controller
                      name="roles"
                      rules={{ required: true }}
                      control={control}
                      render={({ field }) => (
                        <TextField
                          id={field.name}
                          label="角色"
                          required
                          select
                          error={!!errors.roles}
                          helperText={errors.roles ? '角色不能为空' : null}
                          {...(fieldProps as any)}
                          {...field}>
                          {rolesOptions.map((item) => {
                            return (
                              <MenuItem value={item.id}>{item.name}</MenuItem>
                            );
                          })}
                        </TextField>
                      )}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <Controller
                      name="name"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          id={field.name}
                          label="用户名"
                          {...(fieldProps as any)}
                          {...field}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Controller
                      name="email"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          id={field.name}
                          label="邮箱"
                          {...(fieldProps as any)}
                          {...field}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Controller
                      name="phone"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          id={field.name}
                          label="手机号"
                          {...(fieldProps as any)}
                          {...field}
                        />
                      )}
                    />
                  </Grid>
                </>
              )}
            </Grid>
          </form>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setOpen(false);
            }}>
            取消
          </Button>
          <Button
            variant="contained"
            onClick={() => {
              form.current?.dispatchEvent(
                new Event('submit', { cancelable: true, bubbles: true })
              );
            }}>
            确定
          </Button>
        </DialogActions>
      </Dialog>
      <Popover
        open={popConfirm}
        anchorEl={anchorEl}
        onClose={() => setPopConfirm(false)}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}>
        <Typography sx={{ p: 2 }} display="flex" alignItems="center">
          <InfoIcon sx={{ pr: 1 }} color="warning" />
          确定要删除吗?
        </Typography>
        <DialogActions>
          <Button
            size="small"
            onClick={() => {
              setPopConfirm(false);
            }}>
            取消
          </Button>
          <Button
            size="small"
            variant="contained"
            color="error"
            onClick={() => {
              onDelete(currentId);
              setPopConfirm(false);
            }}>
            确定
          </Button>
        </DialogActions>
      </Popover>
    </>
  );
};
export default () => withAuth(Users, undefined, [2]);
