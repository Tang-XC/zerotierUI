import { FC, useState } from 'react';
import { Card, Divider, CardContent, Typography, Box } from '@mui/material';
interface Props {
  title: string;
  children: any;
  style?: any;
  extra?: any;
}
const ZTCard: FC<Props> = (props: Props) => {
  const { title, style, extra } = props;
  return (
    <div style={style}>
      <Card>
        <CardContent>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <Typography variant="h6" component="div">
              {title}
            </Typography>

            <Box>{extra?.()}</Box>
          </Box>
          <Divider
            sx={{
              mt: 1,
            }}
          />
          <div>{props.children}</div>
        </CardContent>
      </Card>
    </div>
  );
};
export default ZTCard;
