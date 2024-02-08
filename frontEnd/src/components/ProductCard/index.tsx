import { FC } from 'react';
import { Box, Grid, Paper, Typography } from '@mui/material';
import { PriceChip } from '@/components';

interface ProductInfo {
  key?: string;
  name: string;
  price: number;
  cover: string;
  desc: string;
}
interface ProductCard {
  products: ProductInfo[];
}
const ProductCard: FC<ProductCard> = (props: ProductCard) => {
  const { products } = props;
  return (
    <Box className="ProductCard">
      <Grid container justifyContent="center" spacing={2}>
        {products.map((item) => {
          return (
            <Grid key={item.key} item>
              <Paper
                elevation={1}
                sx={{
                  width: 240,
                  p: 2,
                  boxSizing: 'border-box',
                }}>
                <Box
                  sx={{
                    maxWidth: 240,
                    minHeight: 200,
                    maxHeight: 200,
                    overflow: 'hidden',
                    display: 'flex',
                    alignItems: 'center',
                    background:
                      'radial-gradient(circle, rgba(0,0,0,0) 0%, rgba(0,0,0,0.1) 100%)',
                  }}>
                  <img src={item.cover} alt="" />
                </Box>
                <Box>
                  <Box
                    sx={{
                      m: '4px 0',
                      fontSize: 20,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      WebkitBoxOrient: 'vertical',
                      WebkitLineClamp: 1,
                    }}>
                    {item.name}
                  </Box>
                  <Box
                    sx={{
                      height: 50,
                      fontSize: 16,
                      color: '#666',
                      mb: 1,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      WebkitBoxOrient: 'vertical',
                      WebkitLineClamp: 2,
                    }}>
                    {item.desc}
                  </Box>
                  <Box>
                    <PriceChip
                      price={item.price}
                      originPrice={item.price + 1000}
                    />
                  </Box>
                </Box>
              </Paper>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
};
export default ProductCard;
