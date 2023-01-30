import { FC } from 'react';
import {
  Card, Row,
} from 'antd';

const { Meta } = Card;

const cssPrefix = 'ftr-dashboard';

interface Props {
  image: string,
  title: any,
  description: any,
}

const DashboardCard: FC<Props> = (newProps) => {
  const { image, title, description } = newProps;
  return (
    <Card hoverable className={`${cssPrefix}__card`}>
      <Row justify="center">
        <img className={`${cssPrefix}__card__img`} src={image} alt="toyourrescue.com" />
      </Row>
      <Row justify="center">
        <Meta style={{ textAlign: 'center' }} title={title} description={description} />
      </Row>
    </Card>
  );
};

export default DashboardCard;
