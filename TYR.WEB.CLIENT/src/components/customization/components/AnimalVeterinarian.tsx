import { useEffect, useState, FC } from 'react';
import {
  Modal, Button, Input, Row, Col, Select, Form, Typography, Tooltip, message,
} from 'antd';
import { InfoCircleOutlined, PlusOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import CustomTable from '../../../shared/components/CustomTable';
import alertConstant from '../../../shared/constants/alert.json';
import { apiCall } from '../../../shared/api/apiWrapper';
import { VeterinarianFormNote } from './Tooltips/VeterinarianFormInfo';
import constants from '../constant.json';

const { confirm } = Modal;

type ValidateStatus = Parameters<typeof Form.Item>[0]['validateStatus'];

interface HospitalClinicInterface {
  id: string;
  hospitalClinicName: string;
}

interface VeterinarianInterface {
  id: string;
  vetName: string
}

interface Props {
  activeTab: string;
}

const AnimalVeterinarians: FC<Props> = (newProps) => {
  const { activeTab } = newProps;
  const newHospitalClinicInterface: HospitalClinicInterface[] = [];
  const newVeterinarianInterface: VeterinarianInterface[] = [];
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [hospitalList, setHospitalList] = useState(newHospitalClinicInterface);
  const [animalVeterinarianList, setAnimalVeterinarianList] = useState(newVeterinarianInterface);
  const [animalVeterinarianId, setAnimalVeterinarianId] = useState(0);
  const [errorMsg, setErrorMsg] = useState('');
  const [validationStatus, setValidationStatus] = useState<{ validateStatus?: ValidateStatus; }>({});
  const [hospital, setHospital] = useState<any>({});
  const [animalVeterinarian, setAnimalVeterinarian] = useState('');
  const [editModal, setEditModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [changeData, setChangeData] = useState(false);
  const [key, setKey] = useState<any>('');
  const [tempForm, setTempForm] = useState('');

  const { Option } = Select;
  const [form] = Form.useForm();

  const cssPrefix = 'ftr-customization';

  const columnData = [{
    title: 'Veterinarian',
    dataIndex: 'vetName',
    width: '80%',
  }];

  const showModal = () => {
    setEditModal(false);
    setTempForm('');
    setIsModalVisible(true);
  };

  const validate = (vet: any): { validateStatus: ValidateStatus } => {
    if (!vet) {
      setErrorMsg('Veterinarian is required');
      return { validateStatus: 'error' };
    }
    if (vet.length > 150) {
      setErrorMsg('Should be less than 150 characters');
      return { validateStatus: 'error' };
    }
    setErrorMsg('');
    return { validateStatus: 'success' };
  };

  function onChange(value: string) {
    const id: number = parseInt(value.split(',')[0], 10);
    const hospitalClinicName: string = value.split(',')[1];
    setHospital({ id, hospitalClinicName });
  }

  const handleInput = (value: string) => {
    setValidationStatus({ ...validate(value) });
    setAnimalVeterinarian(value);
  };

  const setEditModalOpen = (value: boolean, data: any) => {
    setAnimalVeterinarian(data.vetName);
    setTempForm(data.vetName);
    setChangeData(data);
    setAnimalVeterinarianId(data.id);
    setEditModal(value);
    setIsModalVisible(value);
  };

  useEffect(() => {
    const data = {};
    if (parseInt(activeTab, 10) === constants.customization_types.veterinarians) {
      apiCall('hospital-clinic/get-hospital-clinic', 'GET', data)
        .then((resp: any) => {
          if (resp?.status === 200) {
            setHospitalList(resp?.data?.data?.hospitalClinics);
            setHospital({ id: resp?.data?.data?.hospitalClinics?.[0]?.id, hospitalClinicName: resp?.data?.data?.hospitalClinics?.[0]?.hospitalClinicName });
          }
        });
    }
  }, [activeTab]);

  useEffect(() => {
    const data = {};
    if (hospital?.id > 0) {
      apiCall(`vet/get-vet-by-hospitalClinicId?hospitalClinicId=${hospital?.id}`, 'GET', data)
        .then((resp: any) => {
          if (resp?.data?.success) {
            setAnimalVeterinarianList(resp?.data?.data?.vets);
          }
        });
    }
    if (!isModalVisible) {
      setErrorMsg('');
      setLoading(false);
      setAnimalVeterinarian('');
      setChangeData(false);
      setAnimalVeterinarianId(0);
      setValidationStatus({});
    }
    setKey(Date.now());
  }, [hospital, changeData, isModalVisible]);

  const handleOk = async () => {
    if (editModal && animalVeterinarian === tempForm && animalVeterinarian.length > 0) {
      setIsModalVisible(false);
      setEditModal(false);
    } else {
      setLoading(true);
      const validateResponse = validate(animalVeterinarian);
      if (validateResponse && validateResponse.validateStatus !== 'success') {
        setValidationStatus({ ...validate(animalVeterinarian) });
        setLoading(false);
        // eslint-disable-next-line no-useless-return
        return;
      }
      const data = {
        vetName: animalVeterinarian,
        hospitalClinicId: hospital?.id,
      };
      apiCall(`vet/available-vet?vetName=${animalVeterinarian}&hospitalClinicId=${hospital?.id}`, 'get', data)
        .then((resp: any) => {
          if (resp?.data?.data?.isAvailable) {
            setIsModalVisible(false);
            if (!editModal) {
              apiCall('vet/create-vet', 'POST', data)
                .then((respAdd: any) => {
                  if (respAdd?.data?.success) {
                    setChangeData(true);
                    message.success({
                      content: respAdd?.data?.message || alertConstant.veterinarian_add_success,
                      style: {
                        marginTop: '2vh',
                      },
                      key: 'updatable',
                    });
                  }
                });
            } else {
              apiCall(`vet/update-vet/${animalVeterinarianId}`, 'POST', data)
                .then((respUpdate: any) => {
                  if (respUpdate?.data?.success) {
                    setChangeData(true);
                    message.success({
                      content: respUpdate?.data?.message || alertConstant.veterinarian_update_success,
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
              content: resp?.data?.message || alertConstant.veterinarian_duplicate_entry,
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

  const handleVetDelete = (id: string) => {
    const data = '';
    apiCall(`vet/delete-vet/${id}`, 'PATCH', data)
      .then((resp: any) => {
        if (resp?.data?.success) {
          setChangeData(true);
          message.success({
            content: resp?.data?.message || alertConstant.veterinarian_delete_success,
            style: {
              marginTop: '2vh',
            },
            key: 'deletedable',
          });
        }
      });
  };

  const handleCancel = () => {
    if (tempForm === animalVeterinarian) {
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
        title={editModal ? 'Edit Veterinarian' : 'Add Veterinarian'}
        visible={isModalVisible}
        okButtonProps={{ loading }}
        okText={editModal ? 'Update' : 'Save'}
        onOk={form.submit}
        onCancel={handleCancel}
      >
        <div style={{ margin: '10px' }}>
          <b>Clinics/Hospitals</b>
          :
          {` ${hospital.hospitalClinicName}`}
        </div>
        <Form form={form} onFinish={handleOk}>
          <Form.Item
            label="Veterinarian"
            required
            validateStatus={validationStatus.validateStatus}
            help={errorMsg}
          >
            <Input
              key={key}
              ref={(ref) => ref && ref.focus({ cursor: 'end' })}
              value={animalVeterinarian}
              onChange={(e) => {
                handleInput(e.target.value);
              }}
              placeholder="Enter Veterinarian"
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
              placeholder="Select a Clinics/Hospitals"
              optionFilterProp="children"
              // eslint-disable-next-line react/jsx-no-bind
              onChange={onChange}
              value={hospital?.hospitalClinicName}
            >
              {hospitalList?.map((data) => <Option value={`${data.id},${data.hospitalClinicName}`}>{data.hospitalClinicName}</Option>)}
            </Select>
          </Row>
        </Col>
        <Col flex={3}>
          <Row justify="end">
            <Tooltip placement="bottomLeft" title={VeterinarianFormNote}>
              <Typography.Link>
                <InfoCircleOutlined style={{ fontSize: '150%', marginTop: '5px', marginRight: '18px' }} />
              </Typography.Link>
            </Tooltip>
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
      <div style={{ marginTop: '10px' }}>
        <CustomTable
          config={{ rowSelection: 'none' }}
          isNotEditable={false}
          showHeader={false}
          selectable={false}
          tableType="Veterinarian"
          tableData={animalVeterinarianList}
          isLoading={false}
          columnData={columnData}
          delete={handleVetDelete}
          setEditModalOpen={setEditModalOpen}
        />
      </div>
    </>
  );
};

export default AnimalVeterinarians;
