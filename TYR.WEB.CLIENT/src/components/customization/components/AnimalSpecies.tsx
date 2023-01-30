/* eslint-disable no-console */
import { useEffect, useState, FC } from 'react';
import {
  Modal, Button, Input, Row, Col, Select, Form, message,
} from 'antd';
// eslint-disable-next-line no-unused-vars
import { PlusOutlined, InfoCircleOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import CustomTable from '../../../shared/components/CustomTable';
// import {useAnimalTypeApi} from '../../api/useAnimalType';
// import {useAnimalSpeciesApi} from '../../api/useAnimalSpecies';
// eslint-disable-next-line
import alertConstant from '../../../shared/constants/alert.json';
import constants from '../constant.json';
import { AnimalSpecies, AnimalType } from '../Customization.types';

const { confirm } = Modal;

const cssPrefix = 'ftr-customization';

type ValidateStatus = Parameters<typeof Form.Item>[0]['validateStatus'];

interface Props {
  activeTab: string;
}

const AnimalSpeciesComponent: FC<Props> = (newProps) => {
  const { activeTab } = newProps;
  const newAnimalType: AnimalType[] = [];
  const newAnimalSpecies: AnimalSpecies[] = [];
  const [isModalVisible, setIsModalVisible] = useState(false);
  // eslint-disable-next-line
  const [animalTypeList, setAnimalTypeList] = useState(newAnimalType);
  // eslint-disable-next-line
  const [animalSpeciesList, setAnimalSpeciesList] = useState(newAnimalSpecies);
  // eslint-disable-next-line
  const [errorMsg, setErrorMsg] = useState("");
  const [validationStatus, setValidationStatus] = useState<{ validateStatus?: ValidateStatus; }>({});
  const [animalType, setAnimalType] = useState<any>({});
  const [animalSpecies, setAnimalSpecies] = useState('');
  const [editModal, setEditModal] = useState(false);
  // eslint-disable-next-line
  const [editData, setEditData] = useState(Object);
  const [loading, setLoading] = useState(false);
  const [key, setKey] = useState<any>('');
  // eslint-disable-next-line
  const [listLoading, setListLoading] = useState<boolean>(true);
  const [tempForm, setTempForm] = useState('');
  const { Option } = Select;
  const [form] = Form.useForm();

  const showModal = () => {
    setTempForm('');
    setIsModalVisible(true);
  };

  // const animalTypesApi = useAnimalTypeApi();
  // let getAnimalTypes = animalTypesApi.getAnimalTypes;
  // const animalSpeciesApi = useAnimalSpeciesApi();
  // let getAnimalSpecies = animalSpeciesApi.getAnimalSpecies;
  // let addAnimalSpecies = animalSpeciesApi.createAnimalSpecies;
  // let updateAnimalSpecies = animalSpeciesApi.updateAnimalSpeciesQuery;
  // let deleteAnimalSpecies = animalSpeciesApi.deleteAnimalSpecies;

  const validate = (behaviour: any): { validateStatus: ValidateStatus } => {
    if (!behaviour) {
      setErrorMsg('Animal Breed/Specie is required');
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
    setAnimalSpecies(value);
  };

  const setEditModalOpen = (value: boolean, data: any) => {
    setAnimalSpecies(data.breed);
    setTempForm(data.breed);
    setEditData(data);
    setEditModal(value);
    setIsModalVisible(value);
  };

  useEffect(() => {
    setListLoading(false);
    setAnimalTypeList([
      { id: '1', type: 'Dogs' },
      { id: '2', type: 'Cats' },
      { id: '3', type: 'Birds' },
    ]);
    setAnimalSpeciesList([
      { id: '1', breed: 'Huskey' },
      { id: '1', breed: 'Bullmastiff' },
    ]);
    setAnimalType({ id: '1', type: 'Dogs' });
  }, []);

  useEffect(() => {
    if (parseInt(activeTab, 10) !== constants.customization_types.animalSpecies) {
      // eslint-disable-next-line no-useless-return
      return;
    }
    // setListLoading(true);
    // let response1 = getAnimalTypes();
    // response1.then(data => {
    //     if (data?.animalTypes) {
    //         setAnimalType(data.animalTypes[0])
    //         setAnimalTypeList([...data.animalTypes])
    //     }
    // })
  }, [activeTab]);

  useEffect(() => {
    if (!animalType?.id) {
      // eslint-disable-next-line
      return;
    }
    // let response2 = getAnimalSpecies(animalType?.id);
    // response2.then(data => {
    //     if (data?.getAnimalBreeds) {
    //         setListLoading(false);
    //         setAnimalSpeciesList([...data.getAnimalBreeds])
    //     }
    // })
  }, [animalType]);

  useEffect(() => {
    if (!isModalVisible) {
      setErrorMsg('');
      setLoading(false);
      setAnimalSpecies('');
      setValidationStatus({});
    }
    setKey(Date.now());
  }, [isModalVisible]);

  const handleOk = async () => {
    setLoading(true);
    const validateResponse = validate(animalSpecies);
    if (validateResponse && validateResponse.validateStatus !== 'success') {
      setValidationStatus({ ...validate(animalSpecies) });
      setLoading(false);
      // eslint-disable-next-line
      return;
    }

    // let addTypeResponse = editModal ? updateAnimalSpecies(editData.id, animalType?.id, animalSpecies) : addAnimalSpecies(animalType?.id,animalSpecies);

    // addTypeResponse.then(res => {
    //     setLoading(false);
    //     setIsModalVisible(false);
    //     if (res?.createAnimalBreed) {
    //         let {id, breed} = res.createAnimalBreed;
    //         message.success({
    //             content: alertConstant.animal_species_add_success,
    //             style: {
    //                 marginTop: '2vh',
    //             },
    //             key: 'updatable'
    //         })
    //         setAnimalSpeciesList([{id: id, breed: breed}, ...animalSpeciesList]);
    //     } else if (res?.updateAnimalBreed) {
    //         setEditModal(false);
    //         message.success({
    //             content: alertConstant.animal_species_update_success,
    //             style: {
    //                 marginTop: '2vh',
    //             },
    //             key: 'updatable'
    //         });
    //         let newList = [...animalSpeciesList]
    //         animalSpeciesList.map((data, i) => {
    //             if (data.id === editData.id) {
    //                 newList[i].breed = animalSpecies
    //             }
    //         })
    //         setAnimalSpeciesList(newList);
    //     } else {
    //         message.error({
    //             content: editModal ? alertConstant.animal_species_update_error : alertConstant.animal_species_add_failed,
    //             style: {
    //                 marginTop: '2vh',
    //             },
    //             key: 'updatable'
    //         });
    //     }
    // })
    if (!editModal) {
      message.success({
        content: alertConstant.animal_species_add_success,
        style: {
          marginTop: '2vh',
        },
        key: 'updatable',
      });
    } else {
      setEditModal(false);
      message.success({
        content: alertConstant.animal_species_update_success,
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
    // let response = deleteAnimalSpecies(id);
    // response.then((res) => {
    //     if (res?.deleteAnimalBreed) {
    //         message.success({
    //             content: alertConstant.animal_species_delete_success,
    //             style: {
    //                 marginTop: '2vh'
    //             },
    //             key: 'updatable'
    //         });
    //         let newList = [...animalSpeciesList]
    //         animalSpeciesList.map((data, i) => {
    //             if (data.id === id) {
    //                 newList.splice(i, 1);
    //             }
    //         })
    //         setAnimalSpeciesList(newList);
    //     } else {
    //         message.error({
    //             content: alertConstant.animal_species_delete_error,
    //             style: {
    //                 marginTop: '2vh'
    //             },
    //             key: 'updatable'
    //         });
    //     }
    // })

    message.success({
      content: alertConstant.animal_species_delete_success,
      style: {
        marginTop: '2vh',
      },
      key: 'updatable',
    });
  };

  const handleCancel = () => {
    if (tempForm === animalSpecies) {
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
      <Modal title={`${editModal ? 'Edit' : 'Add'} Animal Breed/Specie`} visible={isModalVisible} okButtonProps={{ loading }} onOk={form.submit} onCancel={handleCancel}>
        <div style={{ margin: '10px' }}>
          <b>Animal Type</b>
          :
          {` ${animalType?.type}`}
        </div>
        <Form form={form} onFinish={handleOk}>
          <Form.Item
            label="Animal Breed/Specie"
            required
            validateStatus={validationStatus.validateStatus}
            help={errorMsg}
          >
            <Input
              key={key}
              ref={(ref) => ref && ref.focus({ cursor: 'end' })}
              value={animalSpecies}
              onChange={(e) => {
                handleInput(e.target.value);
              }}
              placeholder="Enter Animal Breed/Specie"
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
              // eslint-disable-next-line
              onChange={onChange}
              // eslint-disable-next-line
              onFocus={onFocus}
              // eslint-disable-next-line
              onBlur={onBlur}
              // eslint-disable-next-line
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
          tableType="Animal Specie"
          tableData={animalSpeciesList}
          isLoading={listLoading}
          columnData={[{
            title: 'Breed or Specie',
            dataIndex: 'breed',
            width: '80%',
          }]}
          delete={handleAnimalBehaviorDelete}
          setEditModalOpen={setEditModalOpen}
        />
      </div>
    </>
  );
};

export default AnimalSpeciesComponent;
