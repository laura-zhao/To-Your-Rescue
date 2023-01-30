import { useEffect, useState, FC } from 'react';
import {
  Modal, Button, Input, Row, Col, Select, Form, message,
} from 'antd';
import { PlusOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import CustomTable from '../../../shared/components/CustomTable';
import alertConstant from '../../../shared/constants/alert.json';
import { apiCall } from '../../../shared/api/apiWrapper';
import constants from '../constant.json';

const { confirm } = Modal;

const cssPrefix = 'ftr-customization';

type ValidateStatus = Parameters<typeof Form.Item>[0]['validateStatus'];

interface AnimalType {
  id: string;
  typeName: string;
}

interface Behaviour {
  id: string;
  behaviorName: string
}

interface Props {
  activeTab: string;
}

const Behaviors: FC<Props> = (newProps) => {
  const { activeTab } = newProps;
  const newAnimalType: AnimalType[] = [];
  const newBehaviour: Behaviour[] = [];
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [animalTypeList, setAnimalTypeList] = useState(newAnimalType);
  const [behaviourList, setBehaviourList] = useState(newBehaviour);
  const [behaviorId, setBehaviorId] = useState(0);
  const [errorMsg, setErrorMsg] = useState('');
  const [validationStatus, setValidationStatus] = useState<{ validateStatus?: ValidateStatus; }>({});
  const [animalType, setAnimalType] = useState<any>({});
  const [behavior, setBehavior] = useState('');
  const [editModal, setEditModal] = useState(false);
  const [changeData, setChangeData] = useState(false);
  const [tempForm, setTempForm] = useState('');
  const [loading, setLoading] = useState(false);
  const [key, setKey] = useState<any>('');

  const { Option } = Select;
  const [form] = Form.useForm();

  const showModal = () => {
    setEditModal(false);
    setTempForm('');
    setIsModalVisible(true);
  };

  useEffect(() => {
    const data = {};
    if (parseInt(activeTab, 10) === constants.customization_types.animalBehavior) {
      apiCall('animaltype/get-animal-types', 'GET', data)
        .then((resp: any) => {
          if (resp?.status === 200) {
            setAnimalTypeList(resp?.data?.data?.animalTypes);
            setAnimalType({ id: resp?.data?.data?.animalTypes?.[0]?.id, typeName: resp?.data?.data?.animalTypes?.[0]?.typeName });
          }
        });
    }
  }, [activeTab]);
  useEffect(() => {
    const data = {};
    if (animalType?.id > 0) {
      apiCall(`behavior/get-behaviors-by-animalId?animalTypeId=${animalType?.id}`, 'GET', data)
        .then((resp: any) => {
          if (resp?.data?.success) {
            setBehaviourList(resp?.data?.data?.behaviors);
          }
        });
    }
    if (!isModalVisible) {
      setErrorMsg('');
      setLoading(false);
      setBehavior('');
      setChangeData(false);
      setBehaviorId(0);
      setValidationStatus({});
    }
    setKey(Date.now());
  }, [animalType, changeData, isModalVisible]);

  const validate = (behaviour: any): { validateStatus: ValidateStatus } => {
    if (!behaviour) {
      setErrorMsg('Behavior is required');
      return { validateStatus: 'error' };
    }
    if (behaviour.length > 25) {
      setErrorMsg('Should be less than 25 characters');
      return { validateStatus: 'error' };
    }
    setErrorMsg('');
    return { validateStatus: 'success' };
  };

  function onChange(value: string) {
    const id: number = parseInt(value.split(',')[0], 10);
    const typeName: string = value.split(' ')[1];
    setAnimalType({ id, typeName });
  }

  function onBlur() {
    console.log('blur');
  }

  function onFocus() {
    console.log('focus');
  }

  function onSearch(value: string) {
    console.log('search:', value);
  }

  const handleInput = (value: string) => {
    setValidationStatus({ ...validate(value) });
    setBehavior(value);
  };

  const setEditModalOpen = (value: boolean, data: any) => {
    setBehavior(data.behaviorName);
    setTempForm(data.behaviorName);
    setBehaviorId(data.id);
    setChangeData(data);
    setEditModal(value);
    setIsModalVisible(value);
  };

  const handleOk = async () => {
    if (editModal && behavior === tempForm && behavior.length > 0) {
      setIsModalVisible(false);
      setEditModal(false);
    } else {
      setLoading(true);
      const validateResponse = validate(behavior);
      if (validateResponse && validateResponse.validateStatus !== 'success') {
        setValidationStatus({ ...validate(behavior) });
        setLoading(false);
        // eslint-disable-next-line no-useless-return
        return;
      }
      const data = {
        behaviorName: behavior,
        AnimalTypeId: animalType?.id,
      };
      apiCall(`behavior/available-behavior?behaviorName=${behavior}&animaltypeId=${animalType?.id}`, 'get', data)
        .then((resp: any) => {
          if (resp?.data?.data?.isAvailable) {
            setIsModalVisible(false);
            if (!editModal) {
              apiCall('behavior/create-behavior', 'POST', data)
                .then((respAdd: any) => {
                  if (respAdd?.data?.success) {
                    setChangeData(true);
                    message.success({
                      content: respAdd?.data?.message || alertConstant.behaviour_add_success,
                      style: {
                        marginTop: '2vh',
                      },
                      key: 'updatable',
                    });
                  }
                });
            } else {
              apiCall(`behavior/update-behavior/${behaviorId}`, 'POST', data)
                .then((respUpdate: any) => {
                  if (respUpdate?.data?.success) {
                    setChangeData(true);
                    message.success({
                      content: respUpdate?.data?.message || alertConstant.behaviour_update_success,
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
              content: resp?.data?.message || alertConstant.behaviour_duplicate_entry,
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

  const handleBehaviorDelete = (id: string) => {
    const data = '';
    apiCall(`behavior/delete-behavior/${id}`, 'PATCH', data)
      .then((resp: any) => {
        if (resp?.data?.success) {
          setChangeData(true);
          message.success({
            content: resp?.data?.message || alertConstant.behaviour_delete_success,
            style: {
              marginTop: '2vh',
            },
            key: 'deletedable',
          });
        }
      });
  };

  const handleCancel = () => {
    if (tempForm === behavior) {
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
        title={`${editModal ? 'Edit' : 'Add'} Behavior`}
        visible={isModalVisible}
        okButtonProps={{ loading }}
        okText={editModal ? 'Update' : 'Save'}
        onOk={form.submit}
        onCancel={handleCancel}
      >
        <div style={{ margin: '10px' }}>
          <b>Animal Type</b>
          :
          {` ${animalType?.typeName}`}
        </div>
        <Form form={form} onFinish={handleOk}>
          <Form.Item
            label="Behavior"
            required
            validateStatus={validationStatus.validateStatus}
            help={errorMsg}
          >
            <Input
              key={key}
              ref={(ref) => ref && ref.focus({ cursor: 'end' })}
              value={behavior}
              onChange={(e) => {
                handleInput(e.target.value);
              }}
              placeholder="Enter Behavior"
            />
          </Form.Item>
        </Form>
      </Modal>
      <Row style={{ marginBottom: '10px', alignItems: 'center' }}>
        <Col flex={3}>
          <Row justify="start" style={{ width: '200px' }}>
            <Select
              showSearch
              style={{ width: 200 }}
              placeholder="Select a animal type"
              optionFilterProp="children"
              // eslint-disable-next-line react/jsx-no-bind
              onChange={onChange}
              // eslint-disable-next-line react/jsx-no-bind
              onFocus={onFocus}
              // eslint-disable-next-line react/jsx-no-bind
              onBlur={onBlur}
              // eslint-disable-next-line react/jsx-no-bind
              onSearch={onSearch}
              value={animalType?.typeName}
            >
              {animalTypeList?.map((data) => <Option value={`${data.id} ${data.typeName}`}>{data.typeName}</Option>)}
            </Select>
          </Row>
        </Col>
        <Col flex={3}>
          <Row justify="end">
            <Button
              disabled={!animalType}
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
      <div style={{ marginTop: '10px' }}>
        <CustomTable
          config={{ rowSelection: 'none' }}
          isNotEditable={false}
          showHeader={false}
          selectable={false}
          tableType="Behavior"
          tableData={behaviourList}
          isLoading={false}
          columnData={[{
            title: 'Behavior',
            dataIndex: 'behaviorName',
            width: '80%',
          }]}
          delete={handleBehaviorDelete}
          setEditModalOpen={setEditModalOpen}
        />
      </div>
    </>
  );
};

export default Behaviors;
