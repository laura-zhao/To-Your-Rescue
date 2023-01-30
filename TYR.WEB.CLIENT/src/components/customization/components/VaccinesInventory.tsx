/* eslint-disable no-console */
import { useEffect, useState, FC } from 'react';
import {
  Modal, Button, Input, Row, Col, DatePicker, Form, Typography, Tooltip, message,
} from 'antd';
import { InfoCircleOutlined, ExclamationCircleOutlined, PlusOutlined } from '@ant-design/icons';
import CustomTable from '../../../shared/components/CustomTable';
// eslint-disable-next-line
import alertConstant from '../../../shared/constants/alert.json';
// import {useAnimalTypeApi} from '../../api/useAnimalType';
// import {useVaccinesInventoryTypeApi} from '../../api/useVaccinesInventory';
import MultiSelect from '../../../shared/components/Inputs/MultiSelect';
import { VaccineFormInfo, VaccineFormNote, VaccineKindExample } from './Tooltips/VaccinesInventoryFormInfo';
import { vaccineInventoryValidate } from '../validation';
import constants from '../constant.json';

const { confirm } = Modal;

const cssPrefix = 'ftr-customization';

const moment = require('moment');

interface AnimalType {
  id: string;
  type: string;
}

interface VaccineInventory {
  id: string;
  kind: string;
  animalType: string;
  vaccineManufacturer: string;
  vaccineSerialNumber: string;
  expirationDate: string;
}

interface Props {
  activeTab: string;
}

const AnimalVaccineInventory: FC<Props> = (newProps) => {
  const { activeTab } = newProps;
  const newAnimalType: AnimalType[] = [];
  // eslint-disable-next-line
  const VaccineInventory: VaccineInventory[] = [];
  const [isModalVisible, setIsModalVisible] = useState(false);
  // eslint-disable-next-line
  const [animalTypeList, setAnimalTypeList] = useState(newAnimalType);
  // eslint-disable-next-line
  const [vaccineInventoryList, setVaccineInventoryList] = useState([{
    id: '1',
    kind: 'Rabies',
    animalType: 'Dogs',
    vaccineManufacturer: 'Merial',
    vaccineSerialNumber: 'e4r5',
    expirationDate: '2021/08/02',
  },
  {
    id: '2',
    kind: 'Polio',
    animalType: 'Cats',
    vaccineManufacturer: 'Merial',
    vaccineSerialNumber: 'e9r5',
    expirationDate: '2020/08/02',
  }]);
  const [vaccineInInventoryForm, setVaccineInInventoryForm] = useState<any>({});
  const [errorMsg, setErrorMsg] = useState(['', '']);
  // eslint-disable-next-line
  const [errorMsg2, setErrorMsg2] = useState('');
  // eslint-disable-next-line
  const [errorMsg3, setErrorMsg3] = useState('');
  // eslint-disable-next-line
  const [errorMsg4, setErrorMsg4] = useState('');
  const [validationActive, setValidationActive] = useState(false);
  const [animalType, setAnimalType] = useState<any>([]);
  // eslint-disable-next-line
  const [vaccineInventory, setVaccineInventory] = useState('');
  const [editModal, setEditModal] = useState(false);
  // eslint-disable-next-line
  const [editData, setEditData] = useState(Object);
  const [key, setKey] = useState<any>('');
  const [tempForm, setTempForm] = useState<any>('');

  const columnData = [
    {
      title: 'Kind',
      dataIndex: 'kind',
      width: '20%',
    },
    {
      title: 'Animal',
      dataIndex: 'animalType',
      width: '20%',
    },
    {
      title: 'Manufacturer',
      dataIndex: 'vaccineManufacturer',
      width: '20%',
    },
    {
      title: 'Serial Number',
      dataIndex: 'vaccineSerialNumber',
      width: '15%',
    },
    {
      title: 'Expires',
      dataIndex: 'expirationDate',
      width: '10%',
    },
  ];

  const showModal = () => {
    setTempForm({});
    setIsModalVisible(true);
  };

  // const animalTypesApi = useAnimalTypeApi();
  // let getAnimalTypes = animalTypesApi.getAnimalTypes;
  // const vaccinesInventoryTypeApi = useVaccinesInventoryTypeApi();
  // let getVaccineInInventory = vaccinesInventoryTypeApi.getVaccinesInventoryType;
  // let addVaccineInventory = vaccinesInventoryTypeApi.createVaccinesInventoryType;
  // let updateHealthProcedure = vaccinesInventoryTypeApi.updateVaccinesInventoryTypeQuery;

  // let deleteHealthProcedure = animalHealthProcedureApi.deleteAnimalHealthProcedure;

  // const validate = (behaviour: any) => {
  //     if (!vaccineInInventoryForm.vaccineKind) {
  //         setErrorMsg1("Please enter vaccine kind");
  //     } else if (vaccineInInventoryForm.vaccineKind.split('').length > 15) {
  //         setErrorMsg1("Should be less than 15 characters");
  //     } else {
  //         setErrorMsg1("");
  //     }

  //     if (!vaccineInInventoryForm.animalTypeId) {
  //         setErrorMsg2("Please select animal type");
  //     } else {
  //         setErrorMsg2("");
  //     }
  //     return;
  // }

  // eslint-disable-next-line
  function onBlur() {
    console.log('blur');
  }

  // eslint-disable-next-line
  function onFocus() {
    console.log('focus');
  }

  // eslint-disable-next-line
  function onSearch(value: string) {
    console.log('search:', value);
  }

  const handleInput = (e: any) => {
    setVaccineInInventoryForm({ ...vaccineInInventoryForm, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    if (!validationActive) {
      return;
    }
    const error = vaccineInventoryValidate(vaccineInInventoryForm);
    setErrorMsg([...error]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vaccineInInventoryForm]);

  const setEditModalOpen = (value: boolean, data: any) => {
    setVaccineInInventoryForm(data);
    setTempForm({ ...data });
    setEditData(data);
    setEditModal(value);
    setIsModalVisible(value);
  };

  useEffect(() => {
    if (parseInt(activeTab, 10) !== constants.customization_types.vaccinesInInventory) {
      // eslint-disable-next-line
      return;
    }
    // let response1 = getAnimalTypes();
    // response1.then(data => {
    //     if (data?.animalTypes) {
    //         setAnimalTypeList([...data.animalTypes])
    //     }
    // })
  }, [activeTab]);

  useEffect(() => {
    setAnimalTypeList([
      { id: '1', type: 'Dogs' },
      { id: '2', type: 'Cats' },
      { id: '3', type: 'Birds' },
    ]);
  }, []);

  useEffect(() => {
    // if(!animalType.id){
    //     return;
    // }
    // let response2 = getHealthProcedure(animalType.id);
    // response2.then(data => {
    //     if (data?.getHealthProcedureByAnimalTypeId) {
    //         setVaccineInventoryList([...data.getHealthProcedureByAnimalTypeId])
    //     }
    // })
    console.log(animalType, '=========>>>>>>');
  }, [animalType]);

  useEffect(() => {
    if (!isModalVisible) {
      setVaccineInInventoryForm({});
      setAnimalType([]);
      setErrorMsg(['', '']);
      setVaccineInventory('');
      setValidationActive(false);
    }
    setKey(Date.now());
  }, [isModalVisible]);

  const handleOk = async () => {
    setValidationActive(true);
    const error = vaccineInventoryValidate(vaccineInInventoryForm);
    setErrorMsg([...error]);
    if (error[0] || error[1]) {
      // eslint-disable-next-line
      return;
    }
    // let addTypeResponse = editModal ? updateHealthProcedure(editData.id, animalType.id) : addVaccineInventory(vaccineInInventoryForm);

    // addTypeResponse.then(res => {
    //     setIsModalVisible(false);
    //     if (res?.createVaccine) {
    //         let {id, healthProcedure} = res.createVaccine;
    //         message.success({
    //             content: alertConstant.animal_behaviour_add_success,
    //             style: {
    //                 marginTop: '2vh',
    //             },
    //             key: 'updatable'
    //         })
    //         setVaccineInventoryList([{...res.createVaccine}, ...vaccineInventoryList]);
    //     } else if (res?.updateHealthProcedures) {
    //         setEditModal(false);
    //         message.success({
    //             content: alertConstant.animal_behaviour_update_success,
    //             style: {
    //                 marginTop: '2vh',
    //             },
    //             key: 'updatable'
    //         });
    //         let newList = [...vaccineInventoryList]
    //         // healthProcedureList.map((data, i) => {
    //         //     if (data.id === editData.id) {
    //         //         newList[i].healthProcedure = healthProcedure
    //         //     }
    //         // })
    //         setVaccineInventoryList(newList);
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
  const handleVaccineInventoryDelete = (id: string) => {
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
    //         let newList = [...healthProcedureList]
    //         healthProcedureList.map((data, i) => {
    //             if (data.id === id) {
    //                 newList.splice(i, 1);
    //             }
    //         })
    //         setVaccineInventoryList(newList);
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
    if (JSON.stringify(tempForm) === JSON.stringify(vaccineInInventoryForm)) {
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
        title={
          (
            <Row align="top">
              <Col span={10}>
                <span>{`${editModal ? 'Edit' : 'Add'} Vaccines In Inventory`}</span>
              </Col>
              <Col>
                <Tooltip placement="bottomLeft" title={VaccineFormNote}>
                  <Typography.Link>
                    <InfoCircleOutlined style={{ fontSize: '150%' }} />
                  </Typography.Link>
                </Tooltip>
              </Col>
            </Row>
          )
        }
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form labelCol={{ span: 6 }} wrapperCol={{ span: 16 }}>
          <Form.Item
            label="Vaccine Kind"
            required
            validateStatus={errorMsg[0] ? 'error' : 'success'}
            help={errorMsg[0]}
            style={{ marginBottom: '0px' }}
          >
            <Row>
              <Col span={22}>
                <Input
                  key={key}
                  ref={(ref) => ref && ref.focus({ cursor: 'end' })}
                  value={vaccineInInventoryForm.kind}
                  name="kind"
                  onChange={(e) => handleInput(e)}
                  placeholder="Enter the Kind of Vaccine"
                />
              </Col>
              <Col style={{ marginLeft: '5px' }} span={1}>
                <Tooltip placement="bottomLeft" title={VaccineKindExample}>
                  <Typography.Link>
                    <InfoCircleOutlined
                      style={{
                        fontSize: '150%',
                        marginTop: '5px',
                        marginRight: '18px',
                      }}
                    />
                  </Typography.Link>
                </Tooltip>
              </Col>
            </Row>
          </Form.Item>
          <Form.Item
            label="Vaccine Is For"
            required
            validateStatus={errorMsg[1] ? 'error' : 'success'}
            help={errorMsg[1]}
            style={{ marginBottom: '0px' }}
          >
            <MultiSelect
              label="Select Animal Types"
              onChange={(data) => setVaccineInInventoryForm({
                ...vaccineInInventoryForm,
                animalTypeId: data,
              })}
              options={animalTypeList.map((data) => ({ label: data.type, value: data.id }))}
              value={vaccineInInventoryForm.animalTypeId}
            />
          </Form.Item>
          <Form.Item
            label="Manufacturer"
            // validateStatus={errorMsg3 ? 'error' : 'success'}
            help={errorMsg3}
            style={{ marginBottom: '0px' }}
          >
            <Input
              value={vaccineInInventoryForm.vaccineManufacturer}
              name="vaccineManufacturer"
              onChange={(e) => handleInput(e)}
              placeholder="Enter Manufacturer"
            />
          </Form.Item>
          <Form.Item
            label="Serial Number"
            // validateStatus={errorMsg4 ? 'error' : 'success'}
            help={errorMsg4}
            style={{ marginBottom: '0px' }}
          >
            <Input
              value={vaccineInInventoryForm.vaccineSerialNumber}
              name="vaccineSerialNumber"
              onChange={(e) => handleInput(e)}
              placeholder="Serial Number"
            />
          </Form.Item>
          <Form.Item
            label="Expiration Date"
          >
            <DatePicker
              value={vaccineInInventoryForm.expirationDate ? moment(vaccineInInventoryForm.expirationDate) : moment('2020/08/02')}
              clearIcon={false}
              onChange={(date, dateString) => {
                setVaccineInInventoryForm({ ...vaccineInInventoryForm, expirationDate: dateString });
              }}
              placeholder="Enter Expiry Date"
            />
          </Form.Item>
        </Form>
      </Modal>
      <Row style={{ marginBottom: '10px', alignItems: 'center' }}>
        <Col flex={3}>
          <Row justify="start" style={{ width: '200px' }} />
        </Col>
        <Col flex={3}>
          <Row justify="end">
            <Tooltip placement="bottomLeft" title={VaccineFormInfo}>
              <Typography.Link>
                <InfoCircleOutlined style={{ fontSize: '150%', marginTop: '5px', marginRight: '18px' }} />
              </Typography.Link>
            </Tooltip>
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
          showHeader
          selectable={false}
          tableType="Vaccine In Inventory"
          isLoading={false}
          tableData={vaccineInventoryList}
          columnData={columnData}
          delete={handleVaccineInventoryDelete}
          setEditModalOpen={setEditModalOpen}
        />
      </div>
    </>
  );
};

export default AnimalVaccineInventory;
