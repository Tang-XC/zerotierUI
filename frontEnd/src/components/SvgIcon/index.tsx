import { FC } from 'react';
interface Props {
  prefix?: string;
  name: string;
  size?: string;
  color?: string;
}
const SvgIcon: FC<Props> = (props) => {
  const { prefix = 'icon', name, size, color } = props;
  return (
    <svg
      className="svg-icon"
      aria-hidden={true}
      style={{
        width: size,
        height: size,
        fill: color,
      }}>
      <use href={`#${prefix}-${name}`} />
    </svg>
  );
};
export default SvgIcon;
