import { useEffect, useState } from 'react';
import {
  Modal, Input, Row, Col, Form, Button, message,
} from 'antd';
import { PlusOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import CustomTable from '../../../shared/components/CustomTable';
import alertConstant from '../../../shared/constants/alert.json';
import { apiCall } from '../../../shared/api/apiWrapper';

const { confirm } = Modal;

const cssPrefix = 'ftr-customization';

type ValidateStatus = Parameters<typeof Form.Item>[0]['validateStatus'];

interface HospitalClinicInterface {
  id: string;
  hospitalClinicName: string
}

export default function HospitalClinics() {
  const newItem: HospitalClinicInterface[] = [];
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [hospitalClinic, setHospitalClinic] = useState('');
  const [hospitalClinicId, setHospitalClinicId] = useState(0);
  const [validationStatus, setValidationStatus] = useState<{ validateStatus?: ValidateStatus; }>({});
  const [hospitalClinicList, setHospitalClinicList] = useState(newItem);
  const [editModal, setEditModal] = useState(false);
  const [changeData, setChangeData] = useState(false);
  const [loading, setLoading] = useState(false);
  const [key, setKey] = useState<any>('');
  const [tempForm, setTempForm] = useState('');
  const [form] = Form.useForm();

  // eslint-disable-next-line
  const onSearch = (searchTextString: string) => {
    console.log('search:', searchTextString);
  };

  useEffect(() => {
    const data = {};
    apiCall('hospital-clinic/get-hospital-clinic', 'GET', data)
      .then((resp: any) => {
        if (resp?.data?.success) {
          setHospitalClinicList(resp?.data?.data?.hospitalClinics);
        }
      });
    if (!isModalVisible) {
      setErrorMsg('');
      setLoading(false);
      setChangeData(false);
      setHospitalClinic('');
      setHospitalClinicId(0);
      setValidationStatus({});
    }
    setKey(Date.now());
  }, [changeData, isModalVisible]);

  const showModal = () => {
    setTempForm('');
    setEditModal(false);
    setIsModalVisible(true);
  };

  const validate = (hospitalClinicData: string): { validateStatus: ValidateStatus } => {
    if (!hospitalClinicData) {
      setErrorMsg('Animal Hospital/Clinic is required');
      return { validateStatus: 'error' };
    }
    if (hospitalClinicData.split('').length > 50) {
      setErrorMsg('Should be less than 50 characters');
      return { validateStatus: 'error' };
    }
    setErrorMsg('');
    return { validateStatus: 'success' };
  };

  const handleAnimalTypeDelete = (id: string) => {
    const data = '';
    apiCall(`hospital-clinic/delete-hospital-clinic/${id}`, 'PATCH', data)
      .then((resp: any) => {
        if (resp?.data?.success) {
          setChangeData(true);
          message.success({
            content: resp?.data?.message || alertConstant.hospital_clinic_delete_success,
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
    setHospitalClinic(data.hospitalClinicName);
    setHospitalClinicId(data.id);
    setTempForm(data.hospitalClinicName);
    setChangeData(data);
    setEditModal(value);
    setIsModalVisible(value);
  };

  const handleOk = async () => {
    if (editModal && hospitalClinic === tempForm && hospitalClinic.length > 0) {
      setIsModalVisible(false);
      setEditModal(false);
    } else {
      setLoading(true);
      const validateResponse = validate(hospitalClinic);
      if (validateResponse && validateResponse.validateStatus !== 'success') {
        setValidationStatus({ ...validate(hospitalClinic) });
        setLoading(false);
        // eslint-disable-next-line
        return;
      }
      const data = {
        hospitalClinicName: hospitalClinic,
      };
      apiCall(`hospital-clinic/available-hospital-clinic?hospitalClinic=${hospitalClinic}`, 'get', data)
        .then((resp: any) => {
          if (resp?.data?.data?.isAvailable) {
            setIsModalVisible(false);
            if (!editModal) {
              apiCall('hospital-clinic/create-hospital-clinic', 'POST', data)
                .then((respAdd: any) => {
                  if (respAdd?.data?.success) {
                    setChangeData(true);
                    message.success({
                      content: respAdd?.data?.message || alertConstant.hospital_clinic_add_success,
                      style: {
                        marginTop: '2vh',
                      },
                      key: 'updatable',
                    });
                  }
                });
            } else {
              apiCall(`hospital-clinic/update-hospital-clinic/${hospitalClinicId}`, 'POST', data)
                .then((respUpdate: any) => {
                  if (respUpdate?.data?.success) {
                    setChangeData(true);
                    message.success({
                      content: respUpdate?.data?.message || alertConstant.hospital_clinic_update_success,
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
              content: resp?.data?.message || alertConstant.hospital_clinic_duplicate_entry,
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
    if (tempForm === hospitalClinic) {
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
        title={editModal ? 'Edit Animal Hospital/Clinic' : 'Add Animal Hospital/Clinic'}
        visible={isModalVisible}
        okButtonProps={{ loading }}
        okText={editModal ? 'Update' : 'Save'}
        onOk={form.submit}
        onCancel={handleCancel}
      >
        <Form onFinish={handleOk} form={form}>
          <Form.Item
            label="Animal Hospital/Clinic"
            required
            validateStatus={validationStatus.validateStatus}
            help={errorMsg}
          >
            <Input
              key={key}
              ref={(ref) => ref && ref.focus({ cursor: 'end' })}
              value={hospitalClinic}
              onChange={(e) => {
                onChangeInput(e.target.value);
                setHospitalClinic(e.target.value);
              }}
              placeholder="Enter Animal Hospital/Clinic"
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
          tableData={hospitalClinicList}
          tableType="Animal Hospital/Clinic"
          isLoading={false}
          columnData={[{
            title: 'Animal Hospital/Clinic',
            dataIndex: 'hospitalClinicName',
            width: '80%',
          }]}
          delete={handleAnimalTypeDelete}
          setEditModalOpen={setEditModalOpen}
        />
      </div>
    </>
  );
}
