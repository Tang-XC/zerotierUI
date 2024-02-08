import { Box } from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import {
  TableContainer,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Paper,
  IconButton,
} from '@mui/material';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import { getRoutesList, createRoute, deleteRoute } from '@/api/zerotier';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useMessage } from '@/contexts/messageContext';

const Routes = () => {
  const params = useParams();
  const columns = [
    {
      title: '目标',
      dataIndex: 'target',
      key: 'target',
    },
    {
      title: '网关',
      dataIndex: 'via',
      key: 'via',
    },
    {
      title: '',
      dataIndex: 'action',
      key: 'action',
      render: (_, record: any) => {
        return (
          <IconButton onClick={() => deleteData(record)}>
            <RemoveCircleIcon sx={{ color: 'error.main' }} />
          </IconButton>
        );
      },
    },
  ];
  const [dataSources, setDataSources] = useState([]);
  const [form, setForm] = useState({
    target: '',
    via: '',
  });
  const { dispatch: dispatchMessage } = useMessage();
  const getData = async () => {
    const result = await getRoutesList({
      networkId: params.id,
    });
    if (result.code === 200) {
      setDataSources(result.data.routes);
    }
  };
  const createData = async () => {
    const result = await createRoute({
      network_id: params.id,
      target: form.target,
      via: form.via,
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
      getData();
      setForm({
        target: '',
        via: '',
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
  const deleteData = async (data: any) => {
    const result = await deleteRoute({
      network_id: params.id,
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
      getData();
    }
  };
  useEffect(() => {
    getData();
  }, []);
  return (
    <Box>
      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              {columns.map((column: any) => (
                <TableCell
                  sx={{
                    color: 'primary.main',
                  }}
                  key={column.key}>
                  {column.title}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {dataSources.map((row: any) => (
              <TableRow
                key={row.id}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                {columns.map((column: any) => (
                  <TableCell key={column.key}>
                    {column.render
                      ? column.render(row[column.dataIndex], row)
                      : row[column.dataIndex]}
                  </TableCell>
                ))}
              </TableRow>
            ))}
            <TableRow>
              <TableCell>
                <TextField
                  size="small"
                  fullWidth
                  placeholder="如，10.11.12.0/24"
                  value={form.target}
                  onChange={(e) => {
                    setForm({
                      ...form,
                      target: e.target.value,
                    });
                  }}
                />
              </TableCell>
              <TableCell>
                <TextField
                  size="small"
                  fullWidth
                  placeholder="如，172.16.2.1 如果目标是ZT网络，请留空。"
                  value={form.via}
                  onChange={(e) => {
                    setForm({
                      ...form,
                      via: e.target.value,
                    });
                  }}
                />
              </TableCell>
              <TableCell>
                <IconButton type="button" onClick={createData}>
                  <AddCircleIcon
                    sx={{
                      color: 'primary.main',
                    }}
                  />
                </IconButton>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};
export default Routes;
