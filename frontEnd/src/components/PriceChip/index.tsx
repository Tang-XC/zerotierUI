import { FC } from 'react';
import { Chip } from '@mui/material';
import { SvgIcon } from '@/components';
import './index.less';
interface PriceChipProps {
  originPrice: number;
  price: number;
  chips?: string[];
}
const PriceChip: FC<PriceChipProps> = (props: PriceChipProps) => {
  const { originPrice, price, chips } = props;
  return (
    <div className="priceChip">
      <div className="priceChip-price">
        <span>¥{price}</span>
      </div>
      <div className="priceChip-originPrice">
        <span>¥{originPrice}</span>
      </div>
      <div className="priceChip-chips">
        {chips?.map((item: string) => (
          <Chip
            key={item}
            label={item}
            sx={{
              mr: 1,
            }}
          />
        ))}
      </div>
    </div>
  );
};
export default PriceChip;
