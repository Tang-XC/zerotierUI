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
import { getIpPoolList, createIpPool, deleteIpPool } from '@/api/zerotier';
import { useParams } from 'react-router-dom';
import { FC, useEffect, useImperativeHandle, useState } from 'react';
import { useMessage } from '@/contexts/messageContext';

interface IpAssignmentProps {
  actionRef: any;
}
const IpAssignment: FC<IpAssignmentProps> = (props: IpAssignmentProps) => {
  const { actionRef } = props;
  const params = useParams();
  const [form, setForm] = useState({
    ip_range_start: '',
    ip_range_end: '',
  });
  const { dispatch: dispatchMessage } = useMessage();

  const columns = [
    {
      title: 'IP地址范围起始地址',
      dataIndex: 'ipRangeStart',
      key: 'ipRangeStart',
    },
    {
      title: 'IP地址范围结束地址',
      dataIndex: 'ipRangeEnd',
      key: 'ipRangeEnd',
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
  const getData = async () => {
    const result = await getIpPoolList({
      networkId: params.id,
    });
    if (result.code === 200) {
      setDataSources(result.data.ip_pools);
    }
  };
  const createData = async () => {
    const result = await createIpPool({
      network_id: params.id,
      ip_range_start: form.ip_range_start,
      ip_range_end: form.ip_range_end,
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
        ip_range_start: '',
        ip_range_end: '',
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
    const result = await deleteIpPool({
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
  useImperativeHandle(
    actionRef,
    () => ({
      refresh: () => {
        getData();
      },
    }),
    []
  );
  useEffect(() => {
    getData();
  }, []);
  return (
    <Box>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} size="small">
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
                  value={form.ip_range_start}
                  onChange={(e) => {
                    setForm({
                      ...form,
                      ip_range_start: e.target.value,
                    });
                  }}
                />
              </TableCell>
              <TableCell>
                <TextField
                  size="small"
                  fullWidth
                  placeholder="如，172.16.2.1 如果目标是ZT网络，请留空。"
                  value={form.ip_range_end}
                  onChange={(e) => {
                    setForm({
                      ...form,
                      ip_range_end: e.target.value,
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
export default IpAssignment;
