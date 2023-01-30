import { useState } from 'react';
import {
  Tabs, Typography,
} from 'antd';
// eslint-disable-next-line no-unused-vars
import { isMobile } from 'react-device-detect';
import AnimalTypes from './components/AnimalTypes';
// import AnimalSpecies from './components/AnimalSpecies';
import AnimalAcquisitionWay from './components/AnimalAcquisitionWay';
// import AnimalBehaviors from './components/AnimalBehaviors';
import Behaviors from './components/Behaviors';
import HospitalClinics from './components/HospitalClinics';
import HealthProcedure from './components/HealthProcedure';
import AnimalVaccinationType from './components/AnimalVaccinationType';
import AnimalVeterinarians from './components/AnimalVeterinarian';
// import VaccinesInventory from './components/VaccinesInventory';
import AnimalMedicine from './components/AnimalMedicine';
import VolunteerActivities from './components/VolunteerActivities';
import OrganizationInfo from './components/OrganizationInfo';
import AnimalRescues from './components/AnimalRescues';
// eslint-disable-next-line
import { CustomizationProps } from "./Customization.types";
import './Customization.less';

// eslint-disable-next-line no-unused-vars
const { Title } = Typography;
const { TabPane } = Tabs;

const cssPrefix = 'ftr-customization';

// eslint-disable-next-line
export const Customization = () => {
  // eslint-disable-next-line
  const [data, setData] = useState('');
  // eslint-disable-next-line
  const [activeTab, setActiveTab] = useState('');

  const customizationTabs = [
    { title: 'Organization Info', content: <OrganizationInfo /> },
    { title: 'Animal Types', content: <AnimalTypes /> },
    { title: 'Animal Acquisition Ways', content: <AnimalAcquisitionWay /> },
    { title: 'Animal Behaviors', content: <Behaviors activeTab={activeTab} /> },
    { title: 'Animal Hospitals/Clinics', content: <HospitalClinics /> },
    { title: 'Veterinarians', content: <AnimalVeterinarians activeTab={activeTab} /> },
    { title: 'Health Procedures', content: <HealthProcedure activeTab={activeTab} /> },
    { title: 'Vaccination Types', content: <AnimalVaccinationType activeTab={activeTab} /> },
    { title: 'Medicines', content: <AnimalMedicine /> },
    { title: 'Volunteer Activities', content: <VolunteerActivities /> },
    { title: 'Other Animal Rescues/Shelters', content: <AnimalRescues /> },
    // { title: 'Animal Breed/Species', content: <AnimalSpecies activeTab={activeTab} /> },
    // { title: 'Vaccines In Inventory', content: <VaccinesInventory activeTab={activeTab} /> },
  ];

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
      {/* <Title level={3} style={{ margin: '16px 0' }}>
        Customization
      </Title> */}
    </div>
  );

  return (
    <div className={`${cssPrefix}`}>
      {pageHeader}
      <div className="desktop-view">
        <Tabs
          onChange={(activeKey) => setActiveTab(activeKey)}
          activeKey={activeTab}
          tabBarStyle={{ width: 230, fontSize: '2px !important' }}
          tabPosition="left"
          style={{ minHeight: '440px', width: '100%' }}
        >
          {customizationTabs.map((value, i) => (
            // eslint-disable-next-line react/no-array-index-key
            <TabPane tab={value.title} key={i} disabled={i === 28}>
              {value.content}
            </TabPane>
          ))}
        </Tabs>
      </div>
      <div className="mobile-view">
        <Tabs
          onChange={(activeKey) => setActiveTab(activeKey)}
          activeKey={activeTab}
          tabBarStyle={{ width: '94vw', fontSize: '2px !important' }}
          tabPosition="top"
          style={{ minHeight: '440px', width: '100%' }}
        >
          {customizationTabs.map((value, i) => (
            // eslint-disable-next-line react/no-array-index-key
            <TabPane tab={value.title} key={i} disabled={i === 28}>
              {value.content}
            </TabPane>
          ))}
        </Tabs>
      </div>
    </div>
  );
};
