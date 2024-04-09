import { FC } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  Button,
} from '@mui/material';
interface Props {
  title: string;
  open: boolean;
  width?: string;
  children?: any;
  isFooter?: boolean;
  onOk?: () => void;
  onCancel?: () => void;
}
const ZTDialog: FC<Props> = (props: Props) => {
  const {
    title,
    open,
    isFooter = true,
    width = '500px',
    onCancel,
    onOk,
  } = props;
  return (
    <>
      <Dialog open={open}>
        <DialogTitle>{title}</DialogTitle>
        <DialogContent sx={{ width }}>{props.children}</DialogContent>
        {isFooter ? (
          <DialogActions>
            <Button onClick={onCancel}>取消</Button>
            <Button variant="contained" onClick={onOk}>
              确定
            </Button>
          </DialogActions>
        ) : null}
      </Dialog>
    </>
  );
};
export default ZTDialog;
