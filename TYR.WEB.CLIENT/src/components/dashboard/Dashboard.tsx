import { useEffect, useRef, FC } from 'react';
import { useNavigate } from 'react-router-dom';
// eslint-disable-next-line no-unused-vars
import Title from 'antd/lib/typography/Title';
import {
  // eslint-disable-next-line no-unused-vars
  Row, Col, Button,
} from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { DashboardProps } from './Dashboard.types';
import Card from './components/Card';
import './Dashboard.less';
import {
  animalIcon, calendarIcon, customizationIcon, thankYouIcon, userIcon, vaccineIcon,
} from '../../assets/images';

const cssPrefix = 'ftr-dashboard';

export const Dashboard: FC<DashboardProps> = (newDashboardProps) => {
  // eslint-disable-next-line no-unused-vars
  const { getCountLoading, counts, getCountCall } = newDashboardProps;
  const navigate = useNavigate();
  const titleRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    getCountCall({}, () => {
      console.log('fetching count');
    });
    titleRef.current?.scrollIntoView();
  }, [titleRef]);

  const cardData = [
    {
      imageUrl: animalIcon,
      title: 'Animals',
      url: '/animals',
      description: (<div>
        {getCountLoading ? <LoadingOutlined style={{ marginRight: '4px' }} spin /> : `${counts?.animalCount?.residentAnimalCount || 0} `}
        Current Residents
        <br />
        {getCountLoading ? <LoadingOutlined style={{ marginRight: '4px' }} spin /> : `${counts?.animalCount?.formarAnimalCount || 0} `}
        Former Residents
      </div>),
    },
    {
      imageUrl: userIcon,
      title: (<div>
        People, Companies,
        <br />
        and Organizations
      </div>),
      url: '/pco',
      description: (<div>
        {getCountLoading ? <LoadingOutlined style={{ marginRight: '4px' }} spin /> : `${counts?.pcoCount?.personCount || 0} `}
        People
        <br />
        {getCountLoading ? <LoadingOutlined style={{ marginRight: '4px' }} spin /> : `${counts?.pcoCount?.organizationCount || 0} `}
        Companies and Organizations
      </div>),
    },
    {
      imageUrl: customizationIcon,
      title: 'Customization',
      url: '/customization',
      description: 'Customize all settings',
    },
    {
      imageUrl: vaccineIcon,
      title: (<div>
        Vaccination and Procedure
        <br />
        Reminders
      </div>),
      url: '',
      description: (<div>
        43 Vaccination Reminders
        <br />
        5 Procedure Reminders
      </div>),
    },
    {
      imageUrl: calendarIcon,
      title: 'Med Reminders',
      url: '',
      description: (<div>
        10 – Today’s Med Reminders
      </div>),
    },
    {
      imageUrl: thankYouIcon,
      title: 'Thank You Reminders',
      url: '',
      description: (<div>
        16 Pending Thank Yous
      </div>),
    },
  ];

  const pageHeader = (
    <div className={`${cssPrefix}__header-row`}>
      <Title level={3} style={{ marginTop: '16px' }}>
        Dashboard
      </Title>
    </div>
  );

  return (
    <div className={`${cssPrefix}`} ref={titleRef}>
      {pageHeader}
      <Row justify="space-around" gutter={[16, 16]}>
        {
          cardData.map((data) => (
            <Col span={8} xs={24} xl={8} onClick={() => navigate(data.url)}>
              <Card image={data.imageUrl} title={data.title} description={data.description} />
            </Col>
          ))
        }
      </Row>
      {/* <Row justify="space-around" gutter={[6, 6]}>
        {
          cardDataTop?.map((data) => (
            <Col span={8} xs={24} xl={8} onClick={() => navigate(data.url)}>
              <Card image={data.imageUrl} title={data.title} description={data.description} />
            </Col>
          ))
        }
        {
          cardDataBottom?.map((data) => (
            <Col span={8} xs={24} xl={8} onClick={() => navigate(data.url)}>
              <Card image={data.imageUrl} title={data.title} description={data.description} />
            </Col>
          ))
        }
      </Row>
      {/* <br />
      <br />
      <Row justify="space-around" gutter={[6, 6]}>
        {
          cardDataBottom.map((data) => (
            <Col onClick={() => navigate(data.url)}>
              <Card image={data.imageUrl} title={data.title} description={data.description} />
            </Col>
          ))
        }
      </Row> */}
      {/* <Row justify="center">
        <Col lg={12} xs={24}>
          <Row justify="center">
            <Button className={`${cssPrefix}__button`} type="primary">Search, Quiereis &amp; Reports</Button>
          </Row>
        </Col>
        <Col lg={12} xs={24}>
          <Row justify="center">
            <Button className={`${cssPrefix}__button`} type="primary">Utilities</Button>
          </Row>
        </Col>
      </Row> */}
    </div>
  );
};
