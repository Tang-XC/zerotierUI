import { FC, useEffect, useState, useRef } from 'react';
import {
  Box,
  Alert,
  IconButton,
  Chip,
  Tabs,
  Tab,
  Grid,
  Tooltip,
  Switch,
  Drawer,
  TextField,
  InputAdornment,
  Popover,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { ZTTable } from '@/components';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckIcon from '@mui/icons-material/Check';
import { useMessage } from '@/contexts/messageContext';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useStepsContext } from '@/contexts/stepContext';
import Joyride from 'react-joyride';
import {
  hostedNetworkDetail,
  getMembershipsList,
  updateMember,
  updateMemberName,
  UpdateMemberAuthorized,
  UpdateMemberActiveBridPge,
  updateMemberIp,
  DeleteMember,
} from '@/api/zerotier';
import SettingsIcon from '@mui/icons-material/Settings';
import Setting from './setting';
import Routes from './routes';
import IpAssignment from './ipAssignment';
import Dns from './dns';
import './index.less';
interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}
const TabPanel: FC<TabPanelProps> = (props: TabPanelProps) => {
  const { children, value, index } = props;
  return (
    <Box
      sx={{
        flexGrow: 1,
      }}
      role="tabpanel"
      hidden={value !== index}>
      {children}
    </Box>
  );
};
const Detail: FC = () => {
  const { state: stepState, dispatch } = useStepsContext();
  const [detailData, setDetailData] = useState<any>({});
  const [activeTab, setActiveTab] = useState(1);
  const [isSettingOpen, setIsSettingOpen] = useState<boolean>(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [currentRecord, setCurrentRecord] = useState<any>({});
  const [isOk, setIsOk] = useState<boolean>(false);
  const [ip, setIp] = useState<String>('');
  const actionRef = useRef<any>();
  const open = Boolean(anchorEl);
  const membersColumns = [
    {
      title: '成员名称',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: any) => {
        return (
          <TextField
            id={record.id}
            defaultValue={text}
            onMouseEnter={() => setIsOk(true)}
            onMouseLeave={() => setIsOk(false)}
            size="small"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  {isOk && (
                    <IconButton
                      size="small"
                      onClick={() => {
                        const input: HTMLInputElement = document.getElementById(
                          record.id
                        ) as HTMLInputElement;
                        updateMemberNameData({
                          ...record,
                          name: input.value,
                        });
                      }}
                      sx={{
                        color: 'primary.main',
                        mr: -1,
                      }}>
                      <CheckIcon />
                    </IconButton>
                  )}
                </InputAdornment>
              ),
            }}
          />
        );
      },
    },
    {
      title: '成员ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: '是否授权',
      dataIndex: 'authorized',
      key: 'authorized',
      render: (text: any, record: any) => {
        return (
          <Switch
            defaultChecked={text}
            onChange={(val) => {
              UpdateMemberAuthorizedData(record.id, val.target.checked);
            }}
          />
        );
      },
    },
    {
      title: '透明桥',
      dataIndex: 'activeBridge',
      key: 'activeBridge',
      render: (text: any, record: any) => {
        // return text ? '是' : '否';
        return (
          <Switch
            defaultChecked={text}
            onChange={(val) => {
              UpdateMemberActiveBridPgeData(record.id, val.target.checked);
            }}
          />
        );
      },
    },
    {
      title: '分配ip',
      dataIndex: 'ip',
      key: 'ip',
      render: (text: any, record: any) => {
        let arrs = JSON.parse(text);
        if (arrs instanceof Array) {
          return (
            <>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                }}>
                <IconButton
                  onClick={(e) => {
                    setCurrentRecord(record);
                    handleClick(e);
                  }}>
                  <VisibilityIcon sx={{ color: 'primary.main' }} />
                </IconButton>
                <span>({arrs.length})</span>
              </Box>
            </>
          );
        }
        return JSON.parse(text).join('，');
      },
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
    },
    {
      title: '延迟',
      dataIndex: 'latency',
      key: 'latency',
      width: 1,
      render: (text: any) => (
        <div
          style={{
            width: '90%',
            textAlign: 'right',
          }}>
          {text + ' ms'}
        </div>
      ),
    },
    {
      title: '',
      dataIndex: 'action',
      key: 'action',
      width: 1,
      render: (text: any, record: any) => {
        return (
          <Box
            sx={{
              width: '100%',
              ml: -1,
              mr: -2,
            }}>
            <Tooltip title="删除">
              <IconButton
                sx={{
                  color: 'error.main',
                }}
                onClick={(event) => {
                  event.stopPropagation();
                  DeleteMemberData(record.id);
                }}>
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          </Box>
        );
      },
    },
  ];
  const tabsItem = [
    {
      label: '成员列表',
      key: 1,
    },
    {
      label: '路由表',
      key: 2,
    },
    {
      label: 'ip分配池',
      key: 3,
    },
    // {
    //   label: 'dns',
    //   key: 4,
    // },
  ];
  const IpAssignmentRef = useRef<any>();
  const RoutesRef = useRef<any>();
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = location.state;
  const { dispatch: dispatchMessage } = useMessage();

  const getDetail = async () => {
    const result = await hostedNetworkDetail(id);
    if (result.code === 200) {
      setDetailData(result.data);
    } else {
      dispatchMessage({
        type: 'SET_MESSAGE',
        payload: {
          type: 'error',
          content: '网络不存在！',
          delay: 5000,
        },
      });
      navigate(-1);
    }
  };
  const getMembers = async () => {
    const result = await getMembershipsList({
      page: 1,
      size: 10,
      networkId: id,
    });
    if (result.code === 200) {
      return {
        data: result.data.members,
      };
    }
    return {
      data: [],
    };
  };
  const updateMemberData = async (data: any, msg: string = '修改成功') => {
    const result = await updateMember({
      ...data,
    });
    if (result.code === 200) {
      dispatchMessage({
        type: 'SET_MESSAGE',
        payload: {
          type: 'success',
          content: msg,
          delay: 5000,
        },
      });
      actionRef.current.reload();
    }
  };
  const updateMemberNameData = async (data: any) => {
    const result = await updateMemberName(data);
    if (result.code === 200) {
      dispatchMessage({
        type: 'SET_MESSAGE',
        payload: {
          type: 'success',
          content: '名称已修改',
          delay: 5000,
        },
      });
      actionRef.current.reload();
    }
  };
  const UpdateMemberAuthorizedData = async (nodeId: string, data: any) => {
    const result = await UpdateMemberAuthorized(id, nodeId, {
      authorized: data,
    });
    if (result.code === 200) {
      dispatchMessage({
        type: 'SET_MESSAGE',
        payload: {
          type: 'success',
          content: '授权已修改',
          delay: 5000,
        },
      });
      setTimeout(() => {
        actionRef.current.reload();
      }, 200);
    }
  };
  const UpdateMemberActiveBridPgeData = async (nodeId: string, data: any) => {
    const result = await UpdateMemberActiveBridPge(id, nodeId, {
      activeBridge: data,
    });
    if (result.code === 200) {
      dispatchMessage({
        type: 'SET_MESSAGE',
        payload: {
          type: 'success',
          content: '透明桥已修改',
          delay: 5000,
        },
      });
      actionRef.current.reload();
    }
  };
  const updateMemberIpData = async (nodeId: string, ips: string[]) => {
    const result = await updateMemberIp(id, nodeId, {
      ipAssignments: [...ips, ip],
    });
    if (result.code === 200) {
      dispatchMessage({
        type: 'SET_MESSAGE',
        payload: {
          type: 'success',
          content: 'ip已添加',
          delay: 5000,
        },
      });
      actionRef.current.reload();
      setIp('');
      handleClose();
    }
  };
  const DeleteMemberData = async (memberId: string) => {
    const result = await DeleteMember(id, memberId);
    if (result.code === 200) {
      window.location.reload();
      dispatchMessage({
        type: 'SET_MESSAGE',
        payload: {
          type: 'success',
          content: '删除成功',
          delay: 5000,
        },
      });
      actionRef.current.reload();
    }
  };
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleSettingCallback = () => {
    IpAssignmentRef.current.refresh();
    RoutesRef.current.refresh();
    window.location.reload();
  };
  const handleStepCallback = (data: any) => {
    if (data.action === 'next' && data.lifecycle === 'complete') {
      setIsSettingOpen(true);
      stepState.stepIndex += 1;
    }
  };
  useEffect(() => {
    getDetail();
  }, []);
  return (
    <Box>
      <Alert
        icon={
          <IconButton
            sx={{
              m: -1,
            }}
            onClick={() => navigate(-1)}>
            <ArrowBackIcon
              sx={{
                color: 'primary.main',
              }}
            />
          </IconButton>
        }
        sx={{
          borderColor: 'primary.main',
          bgcolor: '#fff',
          mb: 2,
          py: 2,
          fontSize: '1rem',
          display: 'flex',
          alignItems: 'center',
          boxSizing: 'border-box',
          '>div': {
            '&:first-child': {
              alignSelf: 'flex-start',
            },
            '&:last-child': {
              flex: 1,
            },
          },
        }}
        variant="outlined">
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mt: -1,
          }}>
          <Box
            sx={{
              mr: 3,
            }}>
            <Chip
              label={
                detailData.base_info?.name +
                '(' +
                detailData.base_info?.id +
                ')'
              }
              color="primary"
            />
          </Box>
          <IconButton
            className="step-five"
            onClick={() => setIsSettingOpen(true)}>
            <SettingsIcon
              sx={{
                color: 'primary.main',
              }}
            />
          </IconButton>
        </Box>
        <Box
          sx={{
            mt: 2,
          }}>
          <Grid container spacing={2}>
            <Grid item xs={3}>
              <div className="detail-item-title">网络名称</div>
              <div className="detail-item-value">
                {detailData.base_info?.name}
              </div>
            </Grid>
            <Grid item xs={3}>
              <div className="detail-item-title">网络ID</div>
              <div className="detail-item-value">
                {detailData.base_info?.id}
              </div>
            </Grid>
            <Grid item xs={3}>
              <div className="detail-item-title">成员</div>
              <div className="detail-item-value">
                <Chip
                  label={
                    detailData.base_info?.members.length +
                    ' / ' +
                    detailData.base_info?.max_memberships
                  }
                />
              </div>
            </Grid>
            <Grid item xs={3}>
              <div className="detail-item-title">创建时间</div>
              <div className="detail-item-value">
                {new Date(detailData.base_info?.created_at).toLocaleString()}
              </div>
            </Grid>
            <Grid item xs={3}>
              <div className="detail-item-title">创建者</div>
              <div className="detail-item-value">
                {detailData.base_info?.owner}
              </div>
            </Grid>
            <Grid item xs={9}>
              <div className="detail-item-title">备注</div>
              <div className="detail-item-value">
                {detailData.base_info?.desc}
              </div>
            </Grid>
          </Grid>
        </Box>
      </Alert>
      <Box>
        <Box>
          <Tabs
            orientation="horizontal"
            variant="scrollable"
            value={activeTab}
            sx={{
              width: '100%',
            }}>
            {tabsItem.map((item, index) => {
              return (
                <Tab
                  key={item.key}
                  label={item.label}
                  value={item.key}
                  sx={{
                    fontSize: '1rem',
                    padding: '8px 28px',
                  }}
                  onClick={() => setActiveTab(item.key)}
                />
              );
            })}
          </Tabs>
        </Box>
        <Box>
          <TabPanel key={1} value={activeTab} index={1}>
            <ZTTable
              actionRef={actionRef}
              columns={membersColumns}
              request={getMembers}
              searchMode="simple"
            />
          </TabPanel>
          <TabPanel key={2} value={activeTab} index={2}>
            <Box>
              <Routes actionRef={RoutesRef} />
            </Box>
          </TabPanel>
          <TabPanel key={3} value={activeTab} index={3}>
            <Box>
              <IpAssignment actionRef={IpAssignmentRef} />
            </Box>
          </TabPanel>
          <TabPanel key={4} value={activeTab} index={4}>
            <Box>
              <Dns />
            </Box>
          </TabPanel>
        </Box>
      </Box>
      <Drawer
        anchor="right"
        open={isSettingOpen}
        onClose={() => setIsSettingOpen(false)}>
        <Setting
          data={detailData}
          onClose={() => setIsSettingOpen(false)}
          onCallback={handleSettingCallback}
        />
      </Drawer>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}>
        <Box sx={{}}>
          <List
            sx={{
              maxHeight: '150px',
              overflow: 'auto',
              overflowX: 'hidden',
            }}>
            {currentRecord.ip &&
              JSON.parse(currentRecord.ip).map((item: any, index: number) => {
                return (
                  <ListItem
                    key={index}
                    sx={{
                      ':hover': {
                        background: '#f5f5f5',
                      },
                    }}>
                    <ListItemText primary={item} />
                    <ListItemIcon
                      sx={{
                        ml: 3,
                        mr: -3,
                      }}>
                      <IconButton
                        style={{
                          display: index === 0 ? 'none' : 'block',
                        }}
                        onClick={() => {
                          const baseIp = JSON.parse(currentRecord.ip) || [];
                          updateMemberIpData(
                            currentRecord.id,
                            baseIp.filter((it: string) => it !== item)
                          );
                        }}>
                        <RemoveCircleIcon
                          sx={{
                            color: 'error.main',
                          }}
                        />
                      </IconButton>
                    </ListItemIcon>
                  </ListItem>
                );
              })}
            {currentRecord.ip && JSON.parse(currentRecord.ip).length === 0 && (
              <ListItem>
                <ListItemText primary="暂无ip" />
              </ListItem>
            )}
          </List>
          <ListItem
            key="action"
            sx={{
              boxShadow: '0 -4px 4px rgba(0, 21, 41, 0.08)',
            }}>
            <TextField
              size="small"
              id="outlined-basic"
              label="ip"
              variant="outlined"
              value={ip}
              onChange={(e) => {
                setIp(e.target.value);
              }}
            />
            <ListItemIcon
              sx={{
                ml: 3,
                mr: -3,
              }}>
              <IconButton
                onClick={() => {
                  updateMemberIpData(
                    currentRecord.id,
                    JSON.parse(currentRecord.ip)
                  );
                }}>
                <AddCircleIcon sx={{ color: 'primary.main' }} />
              </IconButton>
            </ListItemIcon>
          </ListItem>
        </Box>
      </Popover>
      {stepState.isSkip && stepState.stepIndex === 4 && (
        <Joyride
          locale={{
            next: '下一步',
            skip: '不再显示',
            back: '上一步',
            last: '完成',
          }}
          steps={stepState.configNetSteps}
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
export default Detail;
