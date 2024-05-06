import { FC } from 'react';

import { SvgIcon } from '@/components';
import { Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
const _401_: FC = (): JSX.Element => {
  const navigate = useNavigate();
  const handleBack = (): void => {
    navigate(-1);
  };
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
      }}>
      <div className="flex-grow-1 d-flex justify-content-center align-items-center">
        <SvgIcon name="noAuth" size="400" />
      </div>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          ml: '40px',
        }}>
        <div
          style={{
            fontSize: '40px',
            fontWeight: 'bold',
          }}>
          您没有权限
        </div>
        <div
          style={{
            marginTop: '20px',
          }}>
          <Button variant="outlined" onClick={handleBack}>
            返回
          </Button>
          {/* <Button
            variant="contained"
            style={{
              marginLeft: '12px',
            }}
            onClick={() => {
              navigate('/auth');
            }}>
            登录
          </Button> */}
        </div>
      </Box>
    </Box>
  );
};
export default _401_;
