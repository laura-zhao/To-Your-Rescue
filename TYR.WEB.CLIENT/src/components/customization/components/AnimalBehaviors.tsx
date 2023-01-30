/* eslint-disable no-console */
import { useEffect, useState, FC } from 'react';
import {
  Modal, Button, Input, Row, Col, Select, Form, message,
} from 'antd';
// eslint-disable-next-line no-unused-vars
import { PlusOutlined, InfoCircleOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import CustomTable from '../../../shared/components/CustomTable';
// eslint-disable-next-line
import alertConstant from '../../../shared/constants/alert.json';
// import {useAnimalTypeApi} from '../../api/useAnimalType';
// import {useAnimalBehaviour} from '../../api/useAnimalBehaviour';
import constants from '../constant.json';

const { confirm } = Modal;

const cssPrefix = 'ftr-customization';

type ValidateStatus = Parameters<typeof Form.Item>[0]['validateStatus'];

interface AnimalType {
  id: string;
  type: string;
}

interface AnimalBehaviour {
  id: string;
  behavior: string
}

interface Props {
  activeTab: string;
}

const AnimalBehaviors: FC<Props> = (newProps) => {
  const { activeTab } = newProps;
  const newAnimalType: AnimalType[] = [];
  const newAnimalBehaviour: AnimalBehaviour[] = [];
  const [isModalVisible, setIsModalVisible] = useState(false);
  // eslint-disable-next-line
  const [animalTypeList, setAnimalTypeList] = useState(newAnimalType);
  // eslint-disable-next-line
  const [animalBehaviourList, setAnimalBehaviourList] = useState(newAnimalBehaviour);
  const [errorMsg, setErrorMsg] = useState('');
  const [validationStatus, setValidationStatus] = useState<{ validateStatus?: ValidateStatus; }>({});
  const [animalType, setAnimalType] = useState<any>({});
  const [animalBehaviour, setAnimalBehaviour] = useState('');
  const [editModal, setEditModal] = useState(false);
  // eslint-disable-next-line
  const [editData, setEditData] = useState(Object);
  const [tempForm, setTempForm] = useState('');
  const [loading, setLoading] = useState(false);
  const [key, setKey] = useState<any>('');

  const { Option } = Select;
  const [form] = Form.useForm();

  const showModal = () => {
    setTempForm('');
    setIsModalVisible(true);
  };

  useEffect(() => {
    setAnimalTypeList([
      { id: '1', type: 'Dogs' },
      { id: '2', type: 'Cats' },
      { id: '3', type: 'Birds' },
    ]);
    setAnimalBehaviourList([
      { id: '1', behavior: 'Angry' },
      { id: '2', behavior: 'Dirty' },
      { id: '3', behavior: 'Careless' },
    ]);
    setAnimalType({ id: '1', type: 'Dogs' });
  }, []);

  // const animalTypesApi = useAnimalTypeApi();
  // let getAnimalTypes = animalTypesApi.getAnimalTypes;
  // const animalBehaviourApi = useAnimalBehaviour();
  // let getAnimalBehaviour = animalBehaviourApi.getAnimalBehaviour;
  // let addAnimalBehaviour = animalBehaviourApi.createAnimalBehaviour;
  // let updateAnimalBehaviour = animalBehaviourApi.updateAnimalBehaviour;
  // let deleteAnimalBehaviour = animalBehaviourApi.deleteAnimalBehaviour;

  const validate = (behaviour: any): { validateStatus: ValidateStatus } => {
    if (!behaviour) {
      setErrorMsg('Animal Behavior is required');
      return { validateStatus: 'error' };
    }
    if (behaviour.length > 20) {
      setErrorMsg('Should be less than 20 characters');
      return { validateStatus: 'error' };
    }
    setErrorMsg('');
    return { validateStatus: 'success' };
  };

  function onChange(value: string) {
    const id: number = parseInt(value.split(',')[0], 10);
    const type: string = value.split(',')[1];
    setAnimalType({ id, type });
    console.log(`selected ${value}`);
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
    setAnimalBehaviour(value);
  };

  const setEditModalOpen = (value: boolean, data: any) => {
    setAnimalBehaviour(data.behavior);
    setTempForm(data.behavior);
    setEditData(data);
    setEditModal(value);
    setIsModalVisible(value);
  };

  useEffect(() => {
    if (parseInt(activeTab, 10) !== constants.customization_types.animalBehavior) {
      // eslint-disable-next-line
      return;
    }
    // let response1 = getAnimalTypes();
    // response1.then(data => {
    //         if (data?.animalTypes) {
    //             setAnimalType(data.animalTypes[0])
    //             setAnimalTypeList([...data.animalTypes])
    //         }
    // })
  }, [activeTab]);

  useEffect(() => {
    if (!animalType?.id) {
      // eslint-disable-next-line
      return;
    }
    // let response2 = getAnimalBehaviour(animalType?.id);
    // response2.then(data => {
    //     if (data?.getbehaviorByAnimal) {
    //         setAnimalBehaviourList([...data.getbehaviorByAnimal])
    //     }
    // })
  }, [animalType]);

  useEffect(() => {
    if (!isModalVisible) {
      setErrorMsg('');
      setLoading(false);
      setAnimalBehaviour('');
      setValidationStatus({});
    }
    setKey(Date.now());
  }, [isModalVisible]);

  const handleOk = async () => {
    setLoading(true);
    const validateResponse = validate(animalBehaviour);
    if (validateResponse && validateResponse.validateStatus !== 'success') {
      setValidationStatus({ ...validate(animalBehaviour) });
      setLoading(false);
      // eslint-disable-next-line no-useless-return
      return;
    }

    // let addTypeResponse = editModal ? updateAnimalBehaviour(editData.id, animalType?.id, animalBehaviour) : addAnimalBehaviour(animalType?.id,animalBehaviour);

    // addTypeResponse.then(res => {
    //     setLoading(false);
    //     setIsModalVisible(false);
    //     if (res?.createBehavior) {
    //         let {id, behavior} = res.createBehavior;
    //         message.success({
    //             content: alertConstant.animal_behaviour_add_success,
    //             style: {
    //                 marginTop: '2vh',
    //             },
    //             key: 'updatable'
    //         })
    //         setAnimalBehaviourList([{id: id, behavior: behavior}, ...animalBehaviourList]);
    //     } else if (res?.updateBehaviors) {
    //         setEditModal(false);
    //         message.success({
    //             content: alertConstant.animal_behaviour_update_success,
    //             style: {
    //                 marginTop: '2vh',
    //             },
    //             key: 'updatable'
    //         });
    //         let newList = [...animalBehaviourList]
    //         animalBehaviourList.map((data, i) => {
    //             if (data.id === editData.id) {
    //                 newList[i].behavior = animalBehaviour
    //             }
    //         })
    //         setAnimalBehaviourList(newList);
    //     } else {
    //         message.error({
    //             content: editModal ? alertConstant.animal_behaviour_update_error : alertConstant.animal_behaviour_add_failed,
    //             style: {
    //                 marginTop: '2vh',
    //             },
    //             key: 'updatable'
    //         });
    //     }
    // })
    if (!editModal) {
      message.success({
        content: alertConstant.animal_behaviour_add_success,
        style: {
          marginTop: '2vh',
        },
        key: 'updatable',
      });
    } else {
      message.success({
        content: alertConstant.animal_behaviour_update_success,
        style: {
          marginTop: '2vh',
        },
        key: 'updatable',
      });
    }
    setEditModal(false);
    setIsModalVisible(false);
  };

  // eslint-disable-next-line
  const handleAnimalBehaviorDelete = (id: string) => {
    // let response = deleteAnimalBehaviour(id);
    // response.then((res) => {
    //     if (res?.deleteBehavior) {
    //         message.success({
    //             content: alertConstant.animal_behaviour_delete_success,
    //             style: {
    //                 marginTop: '2vh'
    //             },
    //             key: 'updatable'
    //         });
    //         let newList = [...animalBehaviourList]
    //         animalBehaviourList.map((data, i) => {
    //             if (data.id === id) {
    //                 newList.splice(i, 1);
    //             }
    //         })
    //         setAnimalBehaviourList(newList);
    //     } else {
    //         message.error({
    //             content: alertConstant.animal_behaviour_delete_error,
    //             style: {
    //                 marginTop: '2vh'
    //             },
    //             key: 'updatable'
    //         });
    //     }
    // })
    message.success({
      content: alertConstant.animal_behaviour_delete_success,
      style: {
        marginTop: '2vh',
      },
      key: 'updatable',
    });
  };

  const handleCancel = () => {
    if (tempForm === animalBehaviour) {
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
      <Modal title={`${editModal ? 'Edit' : 'Add'} Animal Behavior`} visible={isModalVisible} okButtonProps={{ loading }} onOk={form.submit} onCancel={handleCancel}>
        <div style={{ margin: '10px' }}>
          <b>Animal Type</b>
          :
          {` ${animalType?.type}`}
        </div>
        <Form form={form} onFinish={handleOk}>
          <Form.Item
            label="Animal Behavior"
            required
            validateStatus={validationStatus.validateStatus}
            help={errorMsg}
          >
            <Input
              key={key}
              ref={(ref) => ref && ref.focus({ cursor: 'end' })}
              value={animalBehaviour}
              onChange={(e) => {
                handleInput(e.target.value);
              }}
              placeholder="Enter Animal Behavior"
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
              value={animalType?.type}
            >
              {animalTypeList?.map((data) => <Option value={`${data.id} ${data.type}`}>{data.type}</Option>)}
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
          tableType="Animal Behavior"
          tableData={animalBehaviourList}
          isLoading={false}
          columnData={[{
            title: 'Animal Behavior',
            dataIndex: 'behavior',
            width: '80%',
          }]}
          delete={handleAnimalBehaviorDelete}
          setEditModalOpen={setEditModalOpen}
        />
      </div>
    </>
  );
};

export default AnimalBehaviors;
