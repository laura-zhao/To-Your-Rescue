/* eslint-disable no-unused-vars */
import {
  message, Modal, Select, Button, Typography, Row, Col, Image,
} from 'antd';
import moment from 'moment';
import {
  FlagFilled, PlusOutlined,
} from '@ant-design/icons';
import { useEffect, useState } from 'react';
import { pageLength } from '../../../shared/constants/pagination.json';
import CustomTablePagination from '../../../shared/components/CustomTablePagination';
import { MilestoneAddEditForm } from './MilestoneAddEditForm';
import { apiCall } from '../../../shared/api/apiWrapper';
import './Milestone.less';

interface AnimalMilestoneProps {
  getAnimalMilestoneListCall: any;
  updateAnimalMilestoneListCall: any;
  animalMilestoneList: any;
  getAnimalMilestoneListLoading: boolean;
  selectedAnimalId: any;
  setSelectedPco: any;
  animalList: any;
  selectedPcoId: any;
  updateAnimalMilestoneLoading: boolean;
}

const { Title } = Typography;
const { Option } = Select;
const { confirm } = Modal;

const cssPrefix = 'milestone';

// eslint-disable-next-line
export const AnimalMilestone = (props: AnimalMilestoneProps) => {
  const {
    getAnimalMilestoneListCall, updateAnimalMilestoneListCall, animalMilestoneList, selectedAnimalId, animalList,
    setSelectedPco, selectedPcoId, updateAnimalMilestoneLoading,
  } = props;
  const [currentPageLocal, setCurrentPageLocal] = useState(1);
  const [editRecord, setEditRecord] = useState(null);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [animalDetails, setAnimalDetail] = useState<any>({});
  const [imageUrl, setImageUrl] = useState<any>();

  // eslint-disable-next-line no-unused-vars
  // const onDeleteAnimal = (id: string): void => {
  //   deleteAnimalCall({ id }, () => {
  //     getAnimalListCall({
  //       length: pageLength,
  //       page: currentPageLocal,
  //       isDeleted: false,
  //       isAvailable: tableFilter,
  //       searchText: searchKey,
  //     }, () => console.log('get list of pco'));
  //   });
  // };

  // const getAnimalMilestoneById = (animalId: any) => {
  //   setAnimalDataForDelete('');
  //   apiCall(`animal/get-animal-milestone/${animalId}`, 'GET', {})
  //     .then((resp: any) => {
  //       if (resp.status === 200) {
  //         setAnimalDataForDelete(resp?.data?.data);
  //       }
  //     });
  // };

  useEffect(() => {
    if (selectedAnimalId?.[0]) {
      localStorage.setItem('selectedAnimalId', selectedAnimalId?.[0]);
    } else {
      let animalDetailsJson: any = localStorage.getItem('animalDetails');
      if (animalDetailsJson) {
        animalDetailsJson = JSON.parse(animalDetailsJson);
        setAnimalDetail(animalDetailsJson);
      }
    }
    getAnimalMilestoneListCall({
      animalId: selectedAnimalId?.[0] || localStorage.getItem('selectedAnimalId'),
      length: pageLength,
      page: currentPageLocal,
    }, () => {
      console.log('ddd');
    });

    apiCall(`artifact-attachment/get-artifactattachment-byanimal/${selectedAnimalId?.[0]}`, 'GET', {})
      .then((resp: any) => {
        console.log();
        setImageUrl(resp?.data?.data?.artifactAttachment?.blobUrl);
      });
  }, []);

  useEffect(() => {
    animalList?.forEach((data: any) => {
      if (data?.id === selectedAnimalId?.[0]) {
        localStorage.setItem('animalDetails', JSON.stringify(data));
        setAnimalDetail(data);
      }
    });
  }, [selectedAnimalId]);

  const setEditModalOpen = (value: boolean, data: any) => {
    setEditRecord(data);
    setAddModalVisible(value);
  };

  return (
    <div className={`${cssPrefix}`}>
      <Row align="bottom" justify="space-between">
        <Col>
          <Row>
            <Col>
              <Image
                preview={false}
                src={imageUrl}
                className=""
                style={{
                  objectFit: 'contain',
                  border: '1px dashed #8F8F8F',
                  maxWidth: 100,
                  maxHeight: 100,
                }}
              />
            </Col>
            <Col style={{ marginLeft: '10px' }}>
              <Title style={{ margin: '4px' }} level={3}>{`${animalDetails?.animalName} - ID NO: ${animalDetails?.animalId}`}</Title>
              <Title style={{ margin: '4px' }} level={5}>{`${animalDetails?.breed}, ${animalDetails?.color}`}</Title>
              <Title style={{ margin: '4px' }} level={5}>{`${animalDetails?.sex} - ${(animalMilestoneList?.[0]?.isApproxDOB) ? 'Approx ' : 'Actual '}Birth Date: ${moment(animalMilestoneList?.[0]?.milestoneDate).format('MMM DD YYYY')}`}</Title>
            </Col>
          </Row>
        </Col>
        <Col>
          <Button
            className={`${cssPrefix}__button`}
            style={{ margin: '6px' }}
            type="dashed"
            onClick={() => alert('addd clicked')}
            icon={<PlusOutlined />}
          >
            Add
          </Button>
        </Col>
      </Row>
      <CustomTablePagination
        config={{
          selectable: false,
          isNotEditableBlur: true,
          showHeader: true,
          tableType: 'AnimalMilestone',
        }}
        totalNumber={4}
        currentPage={currentPageLocal}
        setPaginationData={setCurrentPageLocal}
        tableData={animalMilestoneList}
        columnData={[
          {
            title: 'Milestone Date',
            dataIndex: 'milestoneDate',
            render: (data: any) => (data ? moment(data).format('MMM DD YYYY') : ''),
          },
          {
            title: 'Milestone',
            dataIndex: 'milestoneType',
          },
          {
            title: 'First Name',
            dataIndex: ['pco', 'firstName'],
          },
          {
            title: 'Last Name',
            dataIndex: ['pco', 'lastName'],
          },
          {
            title: 'Notes',
            dataIndex: 'notes',
          },
        ]}
        isLoading={false}
        delete={(id: string) => alert('delete')}
        setEditModalOpen={(isOpen: boolean, data: any) => setEditModalOpen(isOpen, data)}
      />
      <MilestoneAddEditForm
        animalDetail={animalDetails}
        editRecord={editRecord}
        visible={addModalVisible}
        setVisible={setAddModalVisible}
        updateAnimalMilestoneListCall={updateAnimalMilestoneListCall}
        animalMilestoneList={animalMilestoneList}
        getAnimalMilestoneListCall={getAnimalMilestoneListCall}
        setSelectedPco={setSelectedPco}
        selectedPcoId={selectedPcoId}
        selectedAnimalId={selectedAnimalId}
        updateAnimalMilestoneLoading={updateAnimalMilestoneLoading}
        animalMilestoneFilter={{
          animalId: selectedAnimalId?.[0],
          length: pageLength,
          page: currentPageLocal,
        }}
      />
    </div>
  );
};

export default AnimalMilestone;
