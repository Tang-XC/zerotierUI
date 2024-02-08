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
const Routes = () => {
  const columns = [
    {
      title: '域名',
      dataIndex: 'domain',
      key: 'gateway',
    },
    {
      title: 'ip',
      dataIndex: 'ip',
      key: 'ip',
    },
    {
      title: '',
      dataIndex: 'action',
      key: 'action',
      render: () => {
        return (
          <IconButton>
            <RemoveCircleIcon sx={{ color: 'error.main' }} />
          </IconButton>
        );
      },
    },
  ];
  const dataSources = [
    {
      gateway: '10.114.108.4',
      target: '10.114.108.0/24	',
    },
    {
      gateway: '0.0.0.0/0',
      target: '10.114.108.4',
    },
    {
      gateway: '10.10.14.2/32',
      target: '10.114.108.4',
    },
  ];
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
                />
              </TableCell>
              <TableCell>
                <TextField
                  size="small"
                  fullWidth
                  placeholder="如，172.16.2.1 如果目标是ZT网络，请留空。"
                />
              </TableCell>
              <TableCell>
                <IconButton type="button">
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
