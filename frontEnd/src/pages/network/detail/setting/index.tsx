import { FC, useEffect } from 'react';
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListSubheader,
  IconButton,
  Switch,
  Divider,
  Accordion,
  AccordionActions,
  AccordionSummary,
  AccordionDetails,
  Grid,
  TextField,
  Button,
  Stack,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useForm, Controller } from 'react-hook-form';
import {
  switchPrivate,
  switchIpv4,
  switchIpv6Zt6plane,
  switchIpv6Rfc4193,
  switchIpv6Auto,
  recoverIpPool,
} from '@/api/zerotier';
import { useLocation } from 'react-router-dom';
import { useMessage } from '@/contexts/messageContext';
import Joyride from 'react-joyride';
import { useStepsContext } from '@/contexts/stepContext';

interface SettingProps {
  data?: any;
  onClose?: () => void;
  onCallback?: () => void;
}
const Setting: FC<SettingProps> = (props: SettingProps) => {
  const { state: stepState, dispatch } = useStepsContext();

  const { onClose, data, onCallback } = props;
  const getInitValues = (params: any) => {
    if (
      data.more_info?.ipAssignmentPools &&
      data.more_info.ipAssignmentPools.length > 0
    ) {
      params.CIDR = data.more_info.ipAssignmentPools[0].ipRangeStart.replace(
        /\.\d+$/,
        '.0/24'
      );
      params.ip_range_start = data.more_info.ipAssignmentPools[0].ipRangeStart;
      params.ip_range_end = data.more_info.ipAssignmentPools[0].ipRangeEnd;
    }
    return params;
  };
  const defaultValues = getInitValues({
    CIDR: '',
    ip_range_start: '',
    ip_range_end: '',
  });
  const fieldProps = {
    fullWidth: true,
  };
  const { id } = useLocation().state;
  const { dispatch: dispatchMessage } = useMessage();
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues,
  });

  const changePrivate = async (val: boolean) => {
    const result = await switchPrivate({
      network_id: id,
      private: val,
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
  const changeIpv4 = async (val: boolean) => {
    const result = await switchIpv4({
      network_id: id,
      zt: val,
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
  const changeIpv6Zt6plane = async (val: boolean) => {
    const result = await switchIpv6Zt6plane({
      network_id: id,
      zt6plane: val,
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
  const changeIpv6Rfc4193 = async (val: boolean) => {
    const result = await switchIpv6Rfc4193({
      network_id: id,
      rfc4193: val,
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
  const changeIpv6Auto = async (val: boolean) => {
    const result = await switchIpv6Auto({
      network_id: id,
      zt: val,
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
  const generateNetwork = () => {
    let ip = `10.${Math.floor(Math.random() * 255)}.${Math.floor(
      Math.random() * 255
    )}.0/24`;
    reset({
      CIDR: ip,
      ip_range_start: ip.split('/')[0].split('.').slice(0, 3).join('.') + '.1',
      ip_range_end: ip.split('/')[0].split('.').slice(0, 3).join('.') + '.254',
    });
  };
  const onSubmit = async (data: any) => {
    const result = await recoverIpPool({
      network_id: id,
      ...data,
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
      onCallback && onCallback();
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
  const handleStepCallback = (data: any) => {
    if (data.action === 'next' && data.lifecycle === 'complete') {
      stepState.stepIndex += 1;
    }
  };

  return (
    <Box
      sx={{
        width: 360,
        p: 2,
        boxSizing: 'border-box',
        height: '100%',
        overflowY: 'scroll',
        //不显示滚动条
        '&::-webkit-scrollbar': {
          display: 'none',
        },
      }}>
      <List
        sx={{ width: '100%', bgcolor: 'background.paper' }}
        subheader={
          <ListSubheader
            sx={{
              display: 'flex',
              alignItems: 'center',
              transform: 'translateY(-20px)',
              py: 1,
            }}>
            <IconButton
              onClick={onClose}
              sx={{
                ml: '-12px',
              }}>
              <ArrowBackIcon />
            </IconButton>
            设置
          </ListSubheader>
        }>
        <ListItem>
          <ListItemText
            id="switch-list-label-wifi"
            primary="私有化"
            secondary="启用访问控制"
          />
          <Switch
            edge="end"
            defaultChecked={data.more_info.private}
            inputProps={{
              'aria-labelledby': 'switch-list-label-wifi',
            }}
            onChange={(e) => {
              changePrivate(e.target.checked);
            }}
          />
        </ListItem>
        <ListItem>
          <ListItemText
            id="switch-list-label-bluetooth"
            primary="IPv4地址分配"
            secondary="启用后，客户端将从IP分配池自动分配IP地址"
          />
          <Switch
            edge="end"
            defaultChecked={data.more_info.v4AssignMode.zt}
            inputProps={{
              'aria-labelledby': 'switch-list-label-bluetooth',
            }}
            onChange={(e) => {
              changeIpv4(e.target.checked);
            }}
          />
        </ListItem>
        <Divider />
        <ListItem>
          <ListItemText
            id="switch-list-label-bluetooth"
            primary="IPv6 ZT 6plane"
            secondary="/80 每个设备都可以路由"
          />
          <Switch
            edge="end"
            defaultChecked={data.more_info.v6AssignMode['6plane']}
            inputProps={{
              'aria-labelledby': 'switch-list-label-bluetooth',
            }}
            onChange={(e) => {
              changeIpv6Zt6plane(e.target.checked);
            }}
          />
        </ListItem>
        <ListItem>
          <ListItemText
            id="switch-list-label-bluetooth"
            primary="IPv6 ZT rfc4193"
            secondary="启用后，客户端将从IP分配池自动分配IP地址"
          />
          <Switch
            edge="end"
            defaultChecked={data.more_info.v6AssignMode.rfc4193}
            inputProps={{
              'aria-labelledby': 'switch-list-label-bluetooth',
            }}
            onChange={(e) => {
              changeIpv6Rfc4193(e.target.checked);
            }}
          />
        </ListItem>
        <ListItem>
          <ListItemText
            id="switch-list-label-bluetooth"
            primary="IPv6 从IP分配池自动分配"
          />
          <Switch
            edge="end"
            defaultChecked={data.more_info.v6AssignMode.zt}
            inputProps={{
              'aria-labelledby': 'switch-list-label-bluetooth',
            }}
            onChange={(e) => {
              changeIpv6Auto(e.target.checked);
            }}
          />
        </ListItem>
        <Divider />
        <ListItem
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
          }}
          className="step-six"
          disablePadding>
          <Accordion
            sx={{
              boxShadow: 'none',
              width: '100%',
            }}
            expanded={true}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              id="panel1-header">
              快速配置
            </AccordionSummary>
            <AccordionDetails>
              <Box
                sx={{
                  width: '100%',
                }}>
                <form onSubmit={handleSubmit(onSubmit)}>
                  <Grid container spacing={1}>
                    <Grid item xs={12}>
                      <Controller
                        name="CIDR"
                        control={control}
                        rules={{ required: true }}
                        render={({ field }) => (
                          <TextField
                            id={field.name}
                            label="CIDR网络地址"
                            required
                            error={!!errors.name}
                            helperText={errors.name ? '网络名称不能为空' : null}
                            {...(fieldProps as any)}
                            {...field}
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Controller
                        name="ip_range_start"
                        control={control}
                        rules={{ required: true }}
                        render={({ field }) => (
                          <TextField
                            id={field.name}
                            label="IP分配池开始地址"
                            required
                            error={!!errors.name}
                            helperText={errors.name ? '网络名称不能为空' : null}
                            {...(fieldProps as any)}
                            {...field}
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Controller
                        name="ip_range_end"
                        control={control}
                        rules={{ required: true }}
                        render={({ field }) => (
                          <TextField
                            id={field.name}
                            label="IP分配池结束地址"
                            required
                            error={!!errors.name}
                            helperText={errors.name ? '网络名称不能为空' : null}
                            {...(fieldProps as any)}
                            {...field}
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Stack spacing={1} direction="row">
                        <Button
                          variant="outlined"
                          sx={{ flex: 1 }}
                          onClick={generateNetwork}>
                          生成网络地址
                        </Button>
                        <Button
                          variant="contained"
                          sx={{ flex: 1 }}
                          type="submit">
                          提交
                        </Button>
                      </Stack>
                    </Grid>
                  </Grid>
                </form>
              </Box>
            </AccordionDetails>
          </Accordion>
        </ListItem>
      </List>
      {stepState.isSkip && stepState.stepIndex === 5 && (
        <Joyride
          styles={{
            options: {
              zIndex: 99999,
            },
          }}
          locale={{
            next: '下一步',
            skip: '不再显示',
            back: '上一步',
            last: '完成',
          }}
          zIndex={1000}
          steps={stepState.lastConfigNetSteps}
          continuous={true}
          showSkipButton={true} // 显示跳过按钮
          disableCloseOnEsc={true} // 按ESC关闭
          disableOverlayClose={true} // 禁用遮罩层关闭
          run={true}
          callback={handleStepCallback}
        />
      )}
    </Box>
  );
};
export default Setting;
