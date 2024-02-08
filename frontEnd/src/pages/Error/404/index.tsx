import { FC } from 'react';
import { SvgIcon } from '@/components';
import { Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
const _404_: FC = (): JSX.Element => {
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
      <div>
        <SvgIcon name="noPage" size="400" />
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
          页面丢失
        </div>
        <div
          style={{
            marginTop: '20px',
          }}>
          <Button variant="contained" onClick={handleBack}>
            返回
          </Button>
        </div>
      </Box>
    </Box>
  );
};
export default _404_;
