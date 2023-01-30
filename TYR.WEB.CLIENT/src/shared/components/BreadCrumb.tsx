/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable no-unused-vars */
import {
  message, Modal, Select, Space, Typography, Row, Col,
} from 'antd';
import {
  FlagFilled,
} from '@ant-design/icons';
import { useLocation, useNavigate } from 'react-router-dom';
import navigationConstant from '../constants/navigationConstant.json';

const navigationConstantObj: any = navigationConstant;

interface BreadCrumbProps {
}

const { Title } = Typography;

const cssPrefix = 'ftr-animals';

// eslint-disable-next-line
export const BreadCrumb = (props: BreadCrumbProps) => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <Row>
      {location?.pathname.split('/')?.map((locationName: any, i) => (
        <Col>
          <Title level={3} style={{ margin: '16px 0' }}>
            <span
              onClick={() => {
                (i < (location?.pathname.split('/')?.length - 1)) && navigate(`/${locationName}`);
              }}
              style={{ color: (i < (location?.pathname.split('/')?.length - 1)) ? 'gray' : '', cursor: 'pointer' }}
            >
              {navigationConstantObj?.[locationName]}
            </span>
            {' '}
            {(i < (location?.pathname.split('/')?.length - 1)) && navigationConstantObj?.[locationName] && (
              '>'
            )}
          </Title>
        </Col>
      ))}
    </Row>
  );
};

export default BreadCrumb;
