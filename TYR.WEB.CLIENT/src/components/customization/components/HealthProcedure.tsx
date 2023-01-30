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

interface AnimalTypeInterface {
  id: string;
  typeName: string;
}

interface HealthProcedureInterface {
  id: string;
  procedureName: string
}

interface Props {
  activeTab: string;
}

const HealthProcedure: FC<Props> = (newProps) => {
  const { activeTab } = newProps;
  const newAnimalType: AnimalTypeInterface[] = [];
  const newHealthProcedure: HealthProcedureInterface[] = [];
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [animalTypeList, setAnimalTypeList] = useState(newAnimalType);
  const [healthProcedureList, setHealthProcedureList] = useState(newHealthProcedure);
  const [errorMsg, setErrorMsg] = useState('');
  const [validationStatus, setValidationStatus] = useState<{ validateStatus?: ValidateStatus; }>({});
  const [animalType, setAnimalType] = useState<any>({});
  const [healthProcedure, setHealthProcedure] = useState('');
  const [healthProcedureId, setHealthProcedureId] = useState(0);
  const [editModal, setEditModal] = useState(false);
  const [changeData, setChangeData] = useState(false);
  const [loading, setLoading] = useState(false);
  const [key, setKey] = useState<any>('');
  const [tempForm, setTempForm] = useState('');
  const { Option } = Select;
  const [form] = Form.useForm();

  const showModal = () => {
    setEditModal(false);
    setTempForm('');
    setIsModalVisible(true);
  };

  useEffect(() => {
    const data = {};
    if (parseInt(activeTab, 10) === constants.customization_types.healthProcedure) {
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
      apiCall(`health-procedure/get-health-procedure-by-animalId?animalTypeId=${animalType?.id}`, 'GET', data)
        .then((resp: any) => {
          if (resp?.data?.success) {
            setHealthProcedureList(resp?.data?.data?.healthProcedures);
          }
        });
    }
    if (!isModalVisible) {
      setErrorMsg('');
      setLoading(false);
      setHealthProcedure('');
      setChangeData(false);
      setHealthProcedureId(0);
      setValidationStatus({});
    }
    setKey(Date.now());
  }, [animalType, changeData, isModalVisible]);

  const validate = (healthProcedureValidate: any): { validateStatus: ValidateStatus } => {
    if (!healthProcedureValidate) {
      setErrorMsg('Health Procedure is required');
      return { validateStatus: 'error' };
    }
    if (healthProcedureValidate.length > 150) {
      setErrorMsg('Should be less than 150 characters');
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
    setHealthProcedure(value);
  };

  const setEditModalOpen = (value: boolean, data: any) => {
    setHealthProcedure(data.procedureName);
    setTempForm(data.procedureName);
    setHealthProcedureId(data.id);
    setChangeData(data);
    setEditModal(value);
    setIsModalVisible(value);
  };

  const handleOk = async () => {
    if (editModal && healthProcedure === tempForm && healthProcedure.length > 0) {
      setIsModalVisible(false);
      setEditModal(false);
    } else {
      setLoading(true);
      const validateResponse = validate(healthProcedure);
      if (validateResponse && validateResponse.validateStatus !== 'success') {
        setValidationStatus({ ...validate(healthProcedure) });
        setLoading(false);
        // eslint-disable-next-line no-useless-return
        return;
      }
      const data = {
        procedureName: healthProcedure,
        AnimalTypeId: animalType?.id,
      };
      apiCall(`health-procedure/available-health-procedure?healthProcedure=${healthProcedure}&animaltypeId=${animalType?.id}`, 'get', data)
        .then((resp: any) => {
          if (resp?.data?.data?.isAvailable) {
            setIsModalVisible(false);
            if (!editModal) {
              apiCall('health-procedure/create-health-procedure', 'POST', data)
                .then((respAdd: any) => {
                  if (respAdd?.data?.success) {
                    setChangeData(true);
                    message.success({
                      content: respAdd?.data?.message || alertConstant.health_procedure_add_success,
                      style: {
                        marginTop: '2vh',
                      },
                      key: 'updatable',
                    });
                  }
                });
            } else {
              apiCall(`health-procedure/update-health-procedure/${healthProcedureId}`, 'POST', data)
                .then((respUpdate: any) => {
                  if (respUpdate?.data?.success) {
                    setChangeData(true);
                    message.success({
                      content: respUpdate?.data?.message || alertConstant.health_procedure_update_success,
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
              content: resp?.data?.message || alertConstant.health_procedure_duplicate_entry,
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

  const handleHealthProcedureDelete = (id: string) => {
    const data = '';
    apiCall(`health-procedure/delete-health-procedure/${id}`, 'PATCH', data)
      .then((resp: any) => {
        if (resp?.data?.success) {
          setChangeData(true);
          message.success({
            content: resp?.data?.message || alertConstant.health_procedure_delete_success,
            style: {
              marginTop: '2vh',
            },
            key: 'deletedable',
          });
        }
      });
  };

  const handleCancel = () => {
    if (tempForm === healthProcedure) {
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
        title={`${editModal ? 'Edit' : 'Add'} Health Procedure`}
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
        <Form onFinish={handleOk} form={form}>
          <Form.Item
            label="Health Procedure"
            required
            validateStatus={validationStatus.validateStatus}
            help={errorMsg}
          >
            <Input
              key={key}
              ref={(ref) => ref && ref.focus({ cursor: 'end' })}
              value={healthProcedure}
              onChange={(e) => {
                handleInput(e.target.value);
              }}
              placeholder="Enter Health Procedure"
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
              value={animalType?.typeName}
            >
              {animalTypeList?.map((data) => <Option value={`${data.id} ${data?.typeName}`}>{data?.typeName}</Option>)}
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
          tableType="Health Procedure"
          isLoading={false}
          tableData={healthProcedureList}
          columnData={[{
            title: 'Health Procedure',
            dataIndex: 'procedureName',
            width: '80%',
          }]}
          delete={handleHealthProcedureDelete}
          setEditModalOpen={setEditModalOpen}
        />
      </div>
    </>
  );
};

export default HealthProcedure;
