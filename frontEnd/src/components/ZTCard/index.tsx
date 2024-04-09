import { FC, useState } from 'react';
import { Card, Divider, CardContent, Typography } from '@mui/material';
interface Props {
  title: string;
  children: any;
  style?: any;
}
const ZTCard: FC<Props> = (props: Props) => {
  const { title, style } = props;
  return (
    <div style={style}>
      <Card>
        <CardContent>
          <Typography variant="h6" component="div">
            {title}
          </Typography>
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
