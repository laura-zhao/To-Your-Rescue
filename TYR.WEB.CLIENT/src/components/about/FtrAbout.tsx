import { Typography } from 'antd';
import { useState } from 'react';
import { AboutProps } from './FtrAbout.types';
import './FtrAbout.less';

const { Title } = Typography;

const cssPrefix = 'ftr-about';

// eslint-disable-next-line no-unused-vars
export const About = (_props: AboutProps) => {
  const [data, setData] = useState(''); // eslint-disable-line

  /**
   *
   * Methods related to CRUD operations goes below
   *
  * */

  /**
   *
   * Navigate or move view to other components
   *
  * */

  /**
   *
   * Business Logic goes below
   *
  * */

  /**
   *
   * All ReactElements or JSX Elements are below
   *
  * */
  const pageHeader = (
    <div className={`${cssPrefix}__header-row`}>
      <Title level={3} style={{ margin: '16px 0' }}>
        About
      </Title>
    </div>
  );

  return (
    <div className={`${cssPrefix}`}>
      {pageHeader}
    </div>
  );
};
