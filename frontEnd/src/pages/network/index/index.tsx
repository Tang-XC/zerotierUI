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
import { useStepsContext } from '@/contexts/stepContext';

import { ZTTable } from '@/components';
import {
  hostedNetworks,
  CreateNetworks,
  UpdateNetworks,
  deleteNetwork,
} from '@/api/zerotier';
import { getSystem } from '@/api/system';
import { useForm, Controller } from 'react-hook-form';
import { useMessage } from '@/contexts/messageContext';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/authContext';
import Joyride from 'react-joyride';

const Index: FC = () => {
  const [actionType, setActionType] = useState(0);
  const [popConfirm, setPopConfirm] = useState(false);
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [currentId, setCurrentId] = useState('');
  const [isStepOpen, setIsStepOpen] = useState(false);
  const form = useRef<HTMLFormElement>(null);
  const actionRef = useRef<any>();
  const { state } = useAuth();
  const { state: stepState, dispatch } = useStepsContext();
  const columns = useMemo(() => {
    let arrs = [
      {
        title: '网络名称',
        dataIndex: 'name',
        key: 'name',
        render: (text, record) => {
          return (
            <span
              className="primary-text"
              style={{ cursor: 'pointer' }}
              onClick={() => {
                navigate('/network/detail', {
                  state: {
                    id: record.id,
                  },
                });
              }}>
              {text}
            </span>
          );
        },
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
                className="step-four"
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
        onClose();
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
    } else if (actionType === 1) {
      const result = await UpdateNetworks(currentId, params);
      if (result.code === 200) {
        onClose();
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
      console.log(result.data.networks);
      return {
        data: result.data.networks.sort((a, b) => b.created_at - a.created_at),
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
    dispatch({
      type: 'SET_NETWORK_ADD_DIALOG',
      payload: true,
    });
  };
  const onEdit = (record: any) => {
    setActionType(1);
    dispatch({
      type: 'SET_NETWORK_ADD_DIALOG',
      payload: true,
    });
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
  const onClose = () => {
    dispatch({
      type: 'SET_NETWORK_ADD_DIALOG',
      payload: false,
    });
    setTimeout(() => {
      setIsStepOpen(true);
    }, 200);
  };
  const handleStepCallback = (data: any) => {
    if (data.action === 'next' && data.lifecycle === 'complete') {
      stepState.stepIndex += 1;
    }
  };
  useEffect(() => {
    getMaxMember();
  }, []);
  return (
    <div className="step-three">
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
      {stepState.isSkip && stepState.stepIndex === 3 && isStepOpen && (
        <Joyride
          locale={{
            next: '下一步',
            skip: '不再显示',
            back: '上一步',
            last: '完成',
          }}
          steps={stepState.openNetSteps}
          continuous={true}
          showSkipButton={true} // 显示跳过按钮
          disableCloseOnEsc={true} // 按ESC关闭
          disableOverlayClose={true} // 禁用遮罩层关闭
          run={true}
          callback={handleStepCallback}
        />
      )}
      <Dialog
        style={{
          zIndex: 10,
        }}
        className="step-three"
        open={stepState.networkAddDialog}
        onClose={() => onClose()}
        scroll="paper">
        <DialogTitle>{actionType === 0 ? '添加' : '编辑'}</DialogTitle>
        <DialogContent
          className="step-three"
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
              onClose();
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
    </div>
  );
};
export default Index;
