import { FC } from 'react';
interface Props {
  onFinish: (values: any) => void;
}
const Form: FC<Props> = (props) => {
  return <h1>Hello world</h1>;
};
export default Form;
