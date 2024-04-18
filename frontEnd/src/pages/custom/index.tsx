import { FC, useEffect, useRef, useState } from 'react';
import {
  Divider,
  Box,
  TextField,
  InputAdornment,
  Tooltip,
  IconButton,
  Button,
} from '@mui/material';
import PhotoIcon from '@mui/icons-material/Photo';
import CheckIcon from '@mui/icons-material/Check';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

import { Upload, ZTCard, ZTTable, ZTDialog, ZTCode } from '@/components';
import {
  getSystem,
  updateSystem,
  getDownLinks,
  deleteDownLink,
} from '@/api/system';
import { useMessage } from '@/contexts/messageContext';
import { useCustom } from '@/contexts/customContext';
import LinkForm from './components/LinkForm';
import './index.less';

const Index: FC = () => {
  const [data, setData] = useState({});
  const [systemName, setSystemName] = useState('');
  const [copyright, setCopyright] = useState('');
  const [slogan, setSlogan] = useState('');
  const [actionType, setActionType] = useState(0);
  const [linkDialog, setLinkDialog] = useState(false);
  const [currentItem, setCurrentItem] = useState({});
  const [maxMember, setMaxMember] = useState<string>('0');
  const [custom_home, setCustom_home] = useState<string>('');
  const [protocol_info, setProtocol_info] = useState<string>('');
  const { dispatch: dispatchMessage } = useMessage();
  const { dispatch: dispatchCustom } = useCustom();
  const actionRef = useRef<any>(null);

  const LinkColumn = [
    {
      title: '链接图标',
      dataIndex: 'icon',
      key: 'icon',
      render: (text: string) => {
        return (
          <div className="custom-link-icon">
            <img
              style={{
                width: '100%',
                height: '100%',
              }}
              src={text}
            />
          </div>
        );
      },
    },
    {
      title: '链接名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '链接地址',
      dataIndex: 'url',
      key: 'url',
    },
    {
      title: '',
      dataIndex: 'action',
      key: 'action',
      render: (_, row: any) => (
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
            <IconButton type="button" onClick={() => onLinkEdit(row)}>
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
            <IconButton type="button" onClick={() => onLinkDelete(row.id)}>
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
  const getData = async () => {
    const result = await getSystem();
    if (result.code === 200) {
      setData(result.data);
      setSystemName(result.data.system_name);
      setSlogan(result.data.slogan);
      setCopyright(result.data.copyright);
      setMaxMember(result.data.max_member);
      setCustom_home(result.data.custom_home);
      setProtocol_info(result.data.protocol_info);
      dispatchCustom(result.data);
    }
  };
  const getLinkData = async () => {
    const result = await getDownLinks();
    if (result.code === 200) {
      return {
        data: result.data,
      };
    }
  };
  const handleUpload = async (file: any) => {
    if (file.length != 0) {
      const reader = new FileReader();
      reader.readAsDataURL(file[0].originFileObj);
      reader.onloadend = async (result) => {
        const response = await updateSystem({
          ...data,
          logo: result.target.result,
        });
        if (response.code === 200) {
          dispatchMessage({
            type: 'SET_MESSAGE',
            payload: {
              type: 'success',
              content: '修改成功',
              delay: 5000,
            },
          });
          getData();
          location.reload();
        }
      };
    } else {
      const response = await updateSystem({
        ...data,
        logo: ' ',
      });
      if (response.code === 200) {
        if (response.code === 200) {
          dispatchMessage({
            type: 'SET_MESSAGE',
            payload: {
              type: 'success',
              content: '修改成功',
              delay: 5000,
            },
          });
          getData();
        }
      }
    }
  };
  const onLinkCreate = async () => {
    setActionType(0);
    setLinkDialog(true);
    setCurrentItem({});
  };
  const onLinkClose = () => {
    setLinkDialog(false);
  };
  const onLinkEdit = (item: any) => {
    setActionType(1);
    setLinkDialog(true);
    setCurrentItem(item);
    actionRef.current.reload();
  };
  const onLinkDelete = async (id: number) => {
    const result = await deleteDownLink(id);
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
    actionRef.current.reload();
  };
  const onCustomHomeSubmit = async () => {
    const result = await updateSystem({
      ...data,
      custom_home: custom_home,
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
      location.reload();
    }
  };
  useEffect(() => {
    getData();
  }, []);
  return (
    <Box>
      <ZTCard title="系统LOGO">
        <Upload
          label=""
          titleDesc="上传LOGO"
          listType="picture-card"
          multiple={false}
          value={
            data.logo && data.logo !== ' '
              ? [
                  {
                    uid: '',
                    name: '',
                    url: data.logo,
                  },
                ]
              : []
          }
          onChange={handleUpload}
          max={1}>
          <Box
            sx={{
              lineHeight: 0,
            }}>
            <PhotoIcon
              sx={{
                fontSize: 64,
              }}
            />
          </Box>
        </Upload>
      </ZTCard>
      <ZTCard title="系统信息" style={{ marginTop: '12px' }}>
        <Box
          sx={{
            width: '40%',
          }}>
          <div>
            <TextField
              margin="normal"
              fullWidth
              label="系统名称"
              size="small"
              value={systemName}
              onChange={(val) => {
                setSystemName(val.target.value);
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      size="small"
                      onClick={async () => {
                        const result = await updateSystem({
                          ...data,
                          system_name: systemName,
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
                          getData();
                          location.reload();
                        }
                      }}
                      sx={{
                        color: 'primary.main',
                        mr: -1,
                      }}>
                      <CheckIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </div>
          <div>
            <TextField
              margin="normal"
              fullWidth
              label="副标题"
              size="small"
              value={slogan}
              onChange={(val) => {
                setSlogan(val.target.value);
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      size="small"
                      onClick={async () => {
                        const result = await updateSystem({
                          ...data,
                          slogan: slogan,
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
                          getData();
                          location.reload();
                        }
                      }}
                      sx={{
                        color: 'primary.main',
                        mr: -1,
                      }}>
                      <CheckIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </div>
          <div>
            <TextField
              margin="normal"
              fullWidth
              label="版权说明"
              size="small"
              multiline
              rows={4}
              value={copyright}
              onChange={(val) => {
                setCopyright(val.target.value);
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      size="small"
                      onClick={async () => {
                        const result = await updateSystem({
                          ...data,
                          copyright: copyright,
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
                          getData();
                          location.reload();
                        }
                      }}
                      sx={{
                        color: 'primary.main',
                        mr: -1,
                      }}>
                      <CheckIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </div>
          <div>
            <TextField
              margin="normal"
              fullWidth
              label="用户协议"
              size="small"
              multiline
              rows={4}
              value={protocol_info}
              onChange={(val) => {
                setProtocol_info(val.target.value);
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      size="small"
                      onClick={async () => {
                        const result = await updateSystem({
                          ...data,
                          protocol_info: protocol_info,
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
                          getData();
                          location.reload();
                        }
                      }}
                      sx={{
                        color: 'primary.main',
                        mr: -1,
                      }}>
                      <CheckIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </div>
        </Box>
      </ZTCard>
      <ZTCard
        title="首页自定义"
        style={{ marginTop: '12px' }}
        extra={() => (
          <Button variant="contained" onClick={onCustomHomeSubmit}>
            提交
          </Button>
        )}>
        <Box
          sx={{
            mt: 2,
          }}
        />
        <ZTCode
          // height="calc(100vh - 433px)"
          value={custom_home}
          onChange={(val) => {
            setCustom_home(val);
          }}
        />
      </ZTCard>
      <ZTCard title="网络创建设置" style={{ marginTop: '12px' }}>
        <TextField
          sx={{ mt: 2 }}
          id="outlined-number"
          label="最大网络成员上线"
          type="number"
          InputLabelProps={{
            shrink: true,
          }}
          value={maxMember}
          onChange={(e: any) => {
            setMaxMember(e.target.value);
          }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  size="small"
                  onClick={async () => {
                    const result = await updateSystem({
                      ...data,
                      max_member: parseInt(maxMember),
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
                      getData();
                    }
                  }}
                  sx={{
                    color: 'primary.main',
                    mr: -1,
                  }}>
                  <CheckIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </ZTCard>
      <ZTCard title="下载链接" style={{ marginTop: '12px' }}>
        <ZTTable
          actionRef={actionRef}
          columns={LinkColumn}
          request={getLinkData}
          onCreate={onLinkCreate}></ZTTable>
      </ZTCard>
      <ZTDialog
        isFooter={false}
        title={actionType === 0 ? '创建链接' : '编辑链接'}
        open={linkDialog}>
        <LinkForm
          onCancel={onLinkClose}
          currentItem={currentItem}
          callback={() => actionRef.current.reload()}
        />
      </ZTDialog>
    </Box>
  );
};
export default Index;
