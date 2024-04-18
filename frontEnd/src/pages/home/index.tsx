import { FC, useEffect, useState } from 'react';
import { Box, Typography, Button, Divider } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useCustom } from '@/contexts/customContext';
import { useAuth } from '@/contexts/authContext';

import { getDownLinks } from '@/api/system';
const Home: FC = () => {
  const navigate = useNavigate();
  const { state } = useCustom();
  const { state: authState } = useAuth();
  const [links, setLinks] = useState([]);
  const getData = async () => {
    const result = await getDownLinks();
    if (result.code === 200) {
      setLinks(result.data);
    }
  };
  useEffect(() => {
    getData();
  }, []);
  return (
    <Box sx={{ height: 'auto', marginTop: '10%', scrollbarWidth: 'none' }}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
        }}>
        <Typography variant="h1">{state.system_name}</Typography>
        <Typography variant="h3">{state.slogan}</Typography>
        {links.length !== 0 ? (
          <Box
            sx={{
              mt: 4,
              display: 'flex',
            }}>
            {links.map((item: any, index) => {
              return (
                <Button
                  sx={{ mr: 1, ml: 1 }}
                  variant="contained"
                  key={index}
                  onClick={() => {
                    window.open(item.url);
                  }}>
                  <img
                    style={{
                      width: '30px',
                      height: '30px',
                      marginRight: '8px',
                    }}
                    src={item.icon}
                    alt={item.name}
                  />
                  {item.name}
                </Button>
              );
            })}
          </Box>
        ) : (
          <Box>
            {authState.roles.map((item) => item.id).includes(2) && (
              <div>
                <span>暂无自定义链接内容,</span>
                <Button onClick={() => navigate('/custom')}>现在去定义</Button>
              </div>
            )}
          </Box>
        )}
      </Box>
      <div dangerouslySetInnerHTML={{ __html: state.custom_home }}></div>
    </Box>
  );
};
export default Home;
