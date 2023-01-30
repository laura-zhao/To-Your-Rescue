import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

// eslint-disable-next-line
const ButtonLoader = () => {
  const antIcon = <LoadingOutlined style={{ fontSize: 24, color: 'white', marginLeft: '8px' }} spin />;

  return (
    <Spin indicator={antIcon} />
  );
};
export default ButtonLoader;
