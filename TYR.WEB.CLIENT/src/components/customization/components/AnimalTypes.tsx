import { useEffect, useState } from 'react';
import {
  Modal, Input, Row, Col, Form, Button, message,
} from 'antd';
import { PlusOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import CustomTable from '../../../shared/components/CustomTable';
import alertConstant from '../../../shared/constants/alert.json';
import { AnimalType } from '../Customization.types';
import { apiCall } from '../../../shared/api/apiWrapper';

const { confirm } = Modal;

const cssPrefix = 'ftr-customization';

type ValidateStatus = Parameters<typeof Form.Item>[0]['validateStatus'];

// eslint-disable-next-line
interface Item {
  id: string;
  type: string;
}

export default function AnimalTypes() {
  const newItem: AnimalType[] = [];
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [animalType, setAnimalType] = useState('');
  const [animalTypeId, setAnimalTypeId] = useState(0);
  const [validationStatus, setValidationStatus] = useState<{ validateStatus?: ValidateStatus; }>({});
  const [animalTypeList, setAnimalTypeList] = useState(newItem);
  const [searchAnimalTypeList, setSearchAnimalTypeList] = useState(newItem);
  const [editModal, setEditModal] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [changeData, setChangeData] = useState(false);
  const [loading, setLoading] = useState(false);
  const [key, setKey] = useState<any>('');
  const [tempForm, setTempForm] = useState('');
  const [form] = Form.useForm();

  // eslint-disable-next-line
  const onSearch = (searchTextString: string) => {
    if (!searchTextString) {
      setSearchText('');
      return;
    }
    setSearchText(searchTextString);
    const newOption: any = [];
    animalTypeList.map((data) => {
      const re = new RegExp(searchTextString.toLowerCase(), 'g');
      if (re.test(data.type.toLowerCase())) {
        newOption.push(data);
      }
      return true;
    });
    setSearchAnimalTypeList(newOption);
  };

  useEffect(() => {
    const data = {};
    apiCall('animaltype/get-animal-types', 'GET', data)
      .then((resp: any) => {
        if (resp?.data?.success) {
          setAnimalTypeList(resp?.data?.data?.animalTypes);
        }
      });
    if (!isModalVisible) {
      setErrorMsg('');
      setLoading(false);
      setChangeData(false);
      setAnimalType('');
      setAnimalTypeId(0);
      setValidationStatus({});
    }
    setKey(Date.now());
  }, [changeData, isModalVisible]);

  const showModal = () => {
    setEditModal(false);
    setTempForm('');
    setIsModalVisible(true);
  };

  const validate = (animalTypeData: string): { validateStatus: ValidateStatus } => {
    if (!animalTypeData) {
      setErrorMsg('Animal Type is required');
      return { validateStatus: 'error' };
    }
    if (animalTypeData.split('').length > 25) {
      setErrorMsg('Should be less than 25 characters');
      return { validateStatus: 'error' };
    }
    setErrorMsg('');
    return { validateStatus: 'success' };
  };

  // eslint-disable-next-line
  const handleAnimalTypeDelete = (id: string) => {
    const data = '';
    apiCall(`animaltype/delete-animal-type/${id}`, 'PATCH', data)
      .then((resp: any) => {
        if (resp?.data?.success) {
          setChangeData(true);
          message.success({
            content: resp?.data?.message || alertConstant.animal_type_delete_success,
            style: {
              marginTop: '2vh',
            },
            key: 'deletedable',
          });
        }
      });
  };

  // eslint-disable-next-line
  const setEditModalOpen = (value: boolean, data: any) => {
    setAnimalType(data.typeName);
    setAnimalTypeId(data.id);
    setTempForm(data.typeName);
    setChangeData(data);
    setEditModal(value);
    setIsModalVisible(value);
  };

  const handleOk = async () => {
    if (editModal && animalType === tempForm && animalType.length > 0) {
      setIsModalVisible(false);
      setEditModal(false);
    } else {
      setLoading(true);
      const validateResponse = validate(animalType);
      if (validateResponse && validateResponse.validateStatus !== 'success') {
        setValidationStatus({ ...validate(animalType) });
        setLoading(false);
        // eslint-disable-next-line
        return;
      }
      const data = {
        typeName: animalType,
      };
      apiCall(`animaltype/available-animal-type?typeName=${animalType}`, 'get', data)
        .then((resp: any) => {
          if (resp?.data?.data?.isAvailable) {
            setIsModalVisible(false);
            if (!editModal) {
              apiCall('animaltype/create-animal-type', 'POST', data)
                .then((respAdd: any) => {
                  if (respAdd?.data?.success) {
                    setChangeData(true);
                    message.success({
                      content: respAdd?.data?.message || alertConstant.animal_type_add_success,
                      style: {
                        marginTop: '2vh',
                      },
                      key: 'updatable',
                    });
                  }
                });
            } else {
              apiCall(`animaltype/update-animal-type/${animalTypeId}`, 'POST', data)
                .then((respUpdate: any) => {
                  if (respUpdate?.data?.success) {
                    setChangeData(true);
                    message.success({
                      content: respUpdate?.data?.message || alertConstant.animal_type_update_success,
                      style: {
                        marginTop: '2vh',
                      },
                      key: 'updatable',
                    });
                  }
                });
            }
          } else {
            message.success({
              content: resp?.data?.message || alertConstant.animal_type_duplicate_entry,
              style: {
                marginTop: '2vh',
              },
              key: 'updatable',
            });
            setIsModalVisible(true);
            setLoading(false);
            if (!editModal) {
              setEditModal(false);
            } else {
              setEditModal(true);
            }
          }
        });
    }
  };

  const onChangeInput = (value: string) => {
    setValidationStatus({ ...validate(value) });
  };

  const handleCancel = () => {
    if (tempForm === animalType) {
      setIsModalVisible(false);
      setEditModal(false);
      return;
    }
    confirm({
      title: 'Do you want to save your changes?',
      icon: <ExclamationCircleOutlined />,
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk() {
        handleOk();
      },
      onCancel() {
        setIsModalVisible(false);
        setEditModal(false);
      },
    });
  };

  return (
    <>
      <Modal
        title={editModal ? 'Edit Animal Type' : 'Add Animal Type'}
        visible={isModalVisible}
        okButtonProps={{ loading }}
        okText={editModal ? 'Update' : 'Save'}
        onOk={form.submit}
        onCancel={handleCancel}
      >
        <p style={{ marginBottom: '0px' }}>
          <b>Note: </b>
          Enter the PLURAL version of the animal types that you rescue.
        </p>
        <p style={{ marginBottom: '20px' }}>
          <b>Examples: </b>
          Dogs not Dog. Rabbits not Rabbit.
        </p>
        <Form onFinish={handleOk} form={form}>
          <Form.Item
            label="Animal Type"
            required
            validateStatus={validationStatus.validateStatus}
            help={errorMsg}
          >
            <Input
              key={key}
              ref={(ref) => ref && ref.focus({ cursor: 'end' })}
              value={animalType}
              onChange={(e) => {
                onChangeInput(e.target.value);
                setAnimalType(e.target.value);
              }}
              placeholder="Enter Animal Type"
            />
          </Form.Item>
        </Form>
      </Modal>
      <div style={{ marginTop: '0px' }}>
        <Row style={{ marginBottom: '10px', alignItems: 'center' }}>
          <Col flex={3}>
            <Row justify="start" style={{ width: '200px' }}>
              {/* <Input
                 onChange={(e)=>onSearch(e.target.value)}
                 placeholder="Search Animal Type"/> */}
            </Row>
          </Col>
          <Col flex={3}>
            <Row justify="end">
              {/* <Typography.Link><PlusOutlined style={{ fontSize: '150%'}} onClick={showModal}/></Typography.Link> */}
              <Button
                className={`${cssPrefix}__button`}
                type="dashed"
                onClick={showModal}
                icon={<PlusOutlined />}
              >
                Add
              </Button>
            </Row>
          </Col>
        </Row>
        <CustomTable
          config={{ rowSelection: 'none' }}
          isNotEditable={false}
          showHeader={false}
          selectable={false}
          tableData={searchText ? searchAnimalTypeList : animalTypeList}
          tableType="Animal Type"
          isLoading={false}
          columnData={[{
            title: 'Animal Type',
            dataIndex: 'typeName',
            width: '80%',
          }]}
          delete={handleAnimalTypeDelete}
          setEditModalOpen={setEditModalOpen}
        />
      </div>
    </>
  );
}
