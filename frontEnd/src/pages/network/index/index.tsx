import { FC, useState, useRef, useMemo, useEffect } from 'react';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  TextField,
  Button,
  Box,
  IconButton,
  Tooltip,
  Divider,
  Popover,
  Typography,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import InfoIcon from '@mui/icons-material/Info';

import { ZTTable } from '@/components';
import { hostedNetworks, CreateNetworks, deleteNetwork } from '@/api/zerotier';
import { getSystem } from '@/api/system';
import { useForm, Controller } from 'react-hook-form';
import { useMessage } from '@/contexts/messageContext';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/authContext';

const Index: FC = () => {
  const [open, setOpen] = useState(false);
  const [actionType, setActionType] = useState(0);
  const [popConfirm, setPopConfirm] = useState(false);
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [currentId, setCurrentId] = useState('');
  const form = useRef<HTMLFormElement>(null);
  const actionRef = useRef<any>();
  const { state } = useAuth();
  const columns = useMemo(() => {
    let arrs = [
      {
        title: '网络名称',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: '网络ID',
        dataIndex: 'id',
        key: 'id',
      },
      {
        title: '成员数量',
        dataIndex: 'members',
        key: 'members',
        render: (text: any, record: any) =>
          text.length + '/' + record.max_memberships,
      },
      {
        title: '拥有者',
        dataIndex: 'owner',
        key: 'owner',
      },
      {
        title: '创建时间',
        dataIndex: 'created_at',
        key: 'created_at',
        render: (text: any) => {
          return new Date(text).toLocaleString();
        },
      },
      {
        title: '备注',
        dataIndex: 'desc',
        key: 'desc',
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
            <Tooltip title="详情">
              <IconButton
                type="button"
                disabled={!state.permissions.includes('network-detail')}
                onClick={() => {
                  setCurrentId(record.id);
                  navigate('/network/detail', {
                    state: {
                      id: record.id,
                    },
                  });
                }}>
                <InfoIcon
                  sx={{
                    cursor: 'pointer',
                    color: 'primary.main',
                  }}
                />
              </IconButton>
            </Tooltip>
            <Divider orientation="vertical" flexItem />

            <Tooltip title="编辑">
              <IconButton
                type="button"
                disabled={!state.permissions.includes('network-edit')}
                onClick={() => {
                  onEdit(record);
                  setCurrentId(record.id);
                }}>
                <EditIcon
                  sx={{
                    cursor: 'pointer',
                    color: 'primary.main',
                  }}
                />
              </IconButton>
            </Tooltip>

            <Divider orientation="vertical" flexItem />
            <Tooltip title="删除">
              <IconButton
                type="button"
                disabled={!state.permissions.includes('network-del')}
                onClick={(event) => {
                  setCurrentId(record.id);
                  setAnchorEl(event.currentTarget);
                  setPopConfirm(true);
                }}>
                <DeleteIcon
                  sx={{
                    cursor: 'pointer',
                    color: 'error.main',
                  }}
                />
              </IconButton>
            </Tooltip>
          </Box>
        ),
      },
    ];
    if (
      !['network-add', 'network-edit', 'network-del', 'network-detail'].every(
        (item) => {
          return state.permissions.includes(item);
        }
      )
    ) {
      arrs = arrs.filter((item) => item.dataIndex != 'action');
    }
    return arrs;
  }, [state]);
  const defaultValues = {
    name: '',
    desc: '',
    max_memberships: 10,
  };
  const {
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm({ defaultValues });
  const { dispatch: dispatchMessage } = useMessage();
  const navigate = useNavigate();

  const fieldProps = {
    fullWidth: true,
    margin: 'normal',
  };
  const onSubmit = async (data: any) => {
    const params = {
      ...data,
      max_memberships: parseInt(data.max_memberships),
    };
    if (actionType === 0) {
      const result = await CreateNetworks(params);
      if (result.code === 200) {
        setOpen(false);
        actionRef.current?.reload();
        dispatchMessage({
          type: 'SET_MESSAGE',
          payload: {
            type: 'success',
            content: result.data,
            delay: 5000,
          },
        });
      }
    }
  };
  const getData = async (params: any) => {
    const result = await hostedNetworks({
      ...params,
    });
    if (result.code === 200) {
      return {
        data: result.data.networks,
      };
    }
    return {
      data: [],
    };
  };
  const getMaxMember = async () => {
    const result = await getSystem();
    if (result.code === 200) {
      reset({
        ...defaultValues,
        max_memberships: result.data.max_member,
      });
    }
  };
  const onCreate = () => {
    setActionType(0);
    setOpen(true);
  };
  const onEdit = (record: any) => {
    setActionType(1);
    setOpen(true);
    reset({
      ...record,
    });
  };
  const onDelete = async (id: string) => {
    const result = await deleteNetwork(id);
    if (result) {
      actionRef.current?.reload();
    }
  };
  useEffect(() => {
    getMaxMember();
  }, []);
  return (
    <>
      <ZTTable
        actionRef={actionRef}
        columns={columns}
        params={{
          page: 1,
          size: 10,
        }}
        request={getData}
        onCreate={onCreate}
        searchMode={'simple'}
      />
      <Dialog open={open} onClose={() => setOpen(false)} scroll="paper">
        <DialogTitle>{actionType === 0 ? '添加' : '编辑'}</DialogTitle>
        <DialogContent
          sx={{
            width: '500px',
          }}>
          <form ref={form} onSubmit={handleSubmit(onSubmit)}>
            <Grid container columnSpacing={1}>
              <Grid item xs={12}>
                <Controller
                  name="name"
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <TextField
                      id={field.name}
                      label="网络名称"
                      required
                      error={!!errors.name}
                      helperText={errors.name ? '网络名称不能为空' : null}
                      {...(fieldProps as any)}
                      {...field}
                    />
                  )}
                />
              </Grid>
              {state.roles.map((item) => item.id).includes(2) && (
                <Grid item xs={12}>
                  <Controller
                    name="max_memberships"
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => (
                      <TextField
                        id={field.name}
                        label="成员上限"
                        type="number"
                        disabled={true}
                        required
                        error={!!errors.max_memberships}
                        helperText={
                          errors.max_memberships ? '成员上限不能为空' : null
                        }
                        {...(fieldProps as any)}
                        {...field}
                      />
                    )}
                  />
                </Grid>
              )}
              <Grid item xs={12}>
                <Controller
                  name="desc"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      id={field.name}
                      label="备注"
                      {...(fieldProps as any)}
                      {...field}
                    />
                  )}
                />
              </Grid>
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
export default Index;
