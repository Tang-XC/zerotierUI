import { FC, useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Grow,
  CircularProgress,
  Slide,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useCustom } from '@/contexts/customContext';
import { useAuth } from '@/contexts/authContext';
import { TransitionGroup } from 'react-transition-group';

import { getDownLinks } from '@/api/system';
const Home: FC = () => {
  const navigate = useNavigate();
  const { state } = useCustom();
  const { state: authState } = useAuth();
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(false);
  const getData = async () => {
    setLoading(true);
    try {
      const result = await getDownLinks();
      if (result.code === 200) {
        setLinks(result.data);
      }
    } catch (error) {
      setLoading(false);
    }
    setLoading(false);
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
        <Slide direction="right" in={true} timeout={150}>
          <Typography variant="h1">{state.system_name}</Typography>
        </Slide>
        <Slide direction="left" in={true} timeout={200}>
          <Typography variant="h3">{state.slogan}</Typography>
        </Slide>
        <>
          {loading ? (
            <Box sx={{ mt: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <>
              {links.length !== 0 ? (
                <Box
                  sx={{
                    mt: 4,
                    display: 'flex',
                  }}>
                  <TransitionGroup>
                    {links.map((item: any, index) => {
                      return (
                        <Grow key={item.name} timeout={800}>
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
                        </Grow>
                      );
                    })}
                  </TransitionGroup>
                </Box>
              ) : (
                <Box>
                  {authState.roles.map((item) => item.id).includes(2) && (
                    <div>
                      <span>暂无自定义链接内容,</span>
                      <Button onClick={() => navigate('/custom')}>
                        现在去定义
                      </Button>
                    </div>
                  )}
                </Box>
              )}
            </>
          )}
        </>
      </Box>
      <div dangerouslySetInnerHTML={{ __html: state.custom_home }}></div>
    </Box>
  );
};
export default Home;
