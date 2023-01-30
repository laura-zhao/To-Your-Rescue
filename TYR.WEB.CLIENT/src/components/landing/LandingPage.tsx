import { useEffect, FC, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Button, Row, Col,
} from 'antd';
import Cookies from 'universal-cookie';
import { animalBanner } from '../../assets/images';
import './LandingPage.less';

const cssPrefix = 'ftr-landing';

// eslint-disable-next-line no-unused-vars
export const LandingPage: FC<any> = ({ login }) => {
  const navigate = useNavigate();
  const cookies = new Cookies();
  const titleRef = useRef<HTMLInputElement>(null);
  const isLoggedIn = cookies.get('login');
  if (isLoggedIn) {
    navigate('/');
  }

  useEffect(() => {
    titleRef.current?.scrollIntoView();
  }, [titleRef]);

  const onClickBuy = () => {
    sessionStorage.setItem('signup-type', 'active');
    navigate('/signup');
  };

  const onClickTrial = () => {
    sessionStorage.setItem('signup-type', 'trialer');
    navigate('/signup');
  };

  return (
    <div className={`${cssPrefix}`} ref={titleRef}>
      <Row justify="center" className={`${cssPrefix}__img_animal_gap`}>
        <img className={`${cssPrefix}__img_animal`} src={animalBanner} alt="toyourrescue.com" />
      </Row>
      <Row gutter={[16, 16]} align="middle" justify="space-around">
        <Col span={8} xs={24} xl={8} className={`${cssPrefix}__button_spaces`}>
          <Button onClick={onClickBuy} className={`${cssPrefix}__button`}>
            Buy Now
          </Button>
        </Col>
        <Col span={8} xs={24} xl={8} className={`${cssPrefix}__button_spaces`}>
          <Button onClick={onClickTrial} className={`${cssPrefix}__button`}>
            Free Trial
          </Button>
        </Col>
        <Col span={8} xs={24} xl={8} className={`${cssPrefix}__button_spaces`}>
          <Button onClick={() => navigate('/login')} className={`${cssPrefix}__button`}>
            Sign In
          </Button>
        </Col>
      </Row>
      <br />
      <br />
      <br />
    </div>
  );
};
