import { Typography } from 'antd';
import { useState } from 'react';
import { QueriesProps } from './FtrQueries.types';
import './FtrQueries.less';

const { Title } = Typography;

const cssPrefix = 'ftr-queries';

// eslint-disable-next-line
export const Queries = (_props: QueriesProps) => {
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
        Queries
      </Title>
    </div>
  );

  return (
    <div className={`${cssPrefix}`}>
      {pageHeader}
    </div>
  );
};

export default Queries;
