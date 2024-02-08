import { AlertColor } from '@mui/material/Alert';
export interface Message {
  type: AlertColor;
  title?: string;
  content: string;
  delay?: number;
}