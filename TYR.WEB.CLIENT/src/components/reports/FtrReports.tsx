import { Typography } from 'antd';
import { useState } from 'react';
import { ReportsProps } from './FtrReports.types';
import './FtrReports.less';

const { Title } = Typography;

const cssPrefix = 'ftr-reports';

// eslint-disable-next-line
export const Reports = (_props: ReportsProps) => {
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
        Reports
      </Title>
    </div>
  );

  return (
    <div className={`${cssPrefix}`}>
      {pageHeader}
    </div>
  );
};

export default Reports;
