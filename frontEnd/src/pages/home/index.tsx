import { FC } from 'react';
import { Box, Typography, Button, Divider } from '@mui/material';
import { useNavigate } from 'react-router-dom';
const Home: FC = () => {
  const navigate = useNavigate();
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: 'calc(100vh - 112px)',
      }}>
      <Typography variant="h1">翼信捷</Typography>
      <Typography variant="h3">SD-LAN控制中心</Typography>
      <Box
        sx={{
          mt: 4,
          display: 'flex',
        }}>
        <Button onClick={() => navigate('/network')} LinkComponent={'a'}>
          网络列表
        </Button>
        <Divider orientation="vertical" sx={{ mx: 2 }} />
        <Button variant="contained" color="primary">
          PLANET文件下载
        </Button>
        <Button
          variant="outlined"
          sx={{
            ml: 2,
          }}>
          客户端下载
        </Button>
      </Box>
    </Box>
  );
};
export default Home;
