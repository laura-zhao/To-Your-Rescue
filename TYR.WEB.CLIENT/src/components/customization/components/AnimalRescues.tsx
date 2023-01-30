import { useEffect, useState } from 'react';
import {
  Modal, Button, Input, Row, Col, Form, message,
} from 'antd';
import { PlusOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import CustomTable from '../../../shared/components/CustomTable';
import alertConstant from '../../../shared/constants/alert.json';
import { apiCall } from '../../../shared/api/apiWrapper';

const { confirm } = Modal;

const cssPrefix = 'ftr-customization';

type ValidateStatus = Parameters<typeof Form.Item>[0]['validateStatus'];

interface AnimalRescueInterface {
  id: string;
  otherRescueShelterName: string
}

const AnimalRescues = () => {
  const newAnimalRescue: AnimalRescueInterface[] = [];
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [AnimalRescueList, setnewAnimalRescueList] = useState(newAnimalRescue);
  const [animalRescueId, setAnimalRescueId] = useState(0);
  const [errorMsg, setErrorMsg] = useState('');
  const [validationStatus, setValidationStatus] = useState<{ validateStatus?: ValidateStatus; }>({});
  const [animalRescue, setAnimalRescue] = useState('');
  const [editModal, setEditModal] = useState(false);
  const [changeData, setChangeData] = useState(false);
  const [tempForm, setTempForm] = useState('');
  const [loading, setLoading] = useState(false);
  const [key, setKey] = useState<any>('');
  const [form] = Form.useForm();

  const showModal = () => {
    setEditModal(false);
    setTempForm('');
    setIsModalVisible(true);
  };

  useEffect(() => {
    const data = {};
    apiCall('other-rescue-shelter/get-other-rescue-shelter', 'GET', data)
      .then((resp: any) => {
        if (resp?.data?.success) {
          setnewAnimalRescueList(resp?.data?.data?.otherRescueShelters);
        }
      });
    if (!isModalVisible) {
      setErrorMsg('');
      setLoading(false);
      setAnimalRescue('');
      setChangeData(false);
      setAnimalRescueId(0);
      setValidationStatus({});
    }
    setKey(Date.now());
  }, [changeData, isModalVisible]);

  const validate = (behaviour: any): { validateStatus: ValidateStatus } => {
    if (!behaviour) {
      setErrorMsg('Other Animal Rescues/Shelters is required');
      return { validateStatus: 'error' };
    }
    if (behaviour.length > 50) {
      setErrorMsg('Should be less than 50 characters');
      return { validateStatus: 'error' };
    }
    setErrorMsg('');
    return { validateStatus: 'success' };
  };

  const handleInput = (value: string) => {
    setValidationStatus({ ...validate(value) });
    setAnimalRescue(value);
  };

  const setEditModalOpen = (value: boolean, data: any) => {
    setAnimalRescue(data.otherRescueShelterName);
    setAnimalRescueId(data.id);
    setTempForm(data.otherRescueShelterName);
    setChangeData(data);
    setEditModal(value);
    setIsModalVisible(value);
  };

  const handleOk = async () => {
    if (editModal && animalRescue === tempForm && animalRescue.length > 0) {
      setIsModalVisible(false);
      setEditModal(false);
    } else {
      setLoading(true);
      const validateResponse = validate(animalRescue);
      if (validateResponse && validateResponse.validateStatus !== 'success') {
        setValidationStatus({ ...validate(animalRescue) });
        setLoading(false);
        // eslint-disable-next-line
        return;
      }
      const data = {
        otherRescueShelterName: animalRescue,
      };
      apiCall(`other-rescue-shelter/available-other-rescue-shelter?otherRescueShelter=${animalRescue}`, 'get', data)
        .then((resp: any) => {
          if (resp?.data?.data?.isAvailable) {
            setIsModalVisible(false);
            if (!editModal) {
              apiCall('other-rescue-shelter/create-other-rescue-shelter', 'POST', data)
                .then((respAdd: any) => {
                  if (respAdd?.data?.success) {
                    setChangeData(true);
                    message.success({
                      content: respAdd?.data?.message || alertConstant.other_rescue_shelter_add_success,
                      style: {
                        marginTop: '2vh',
                      },
                      key: 'updatable',
                    });
                  }
                });
            } else {
              apiCall(`other-rescue-shelter/update-other-rescue-shelter/${animalRescueId}`, 'POST', data)
                .then((respUpdate: any) => {
                  if (respUpdate?.data?.success) {
                    setChangeData(true);
                    message.success({
                      content: respUpdate?.data?.message || alertConstant.other_rescue_shelter_update_success,
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
              content: resp?.data?.message || alertConstant.other_rescue_shelter_duplicate_entry,
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

  const handleAnimalHospitalDelete = (id: string) => {
    const data = '';
    apiCall(`other-rescue-shelter/delete-other-rescue-shelter/${id}`, 'PATCH', data)
      .then((resp: any) => {
        if (resp?.data?.success) {
          setChangeData(true);
          message.success({
            content: resp?.data?.message || alertConstant.other_rescue_shelter_delete_success,
            style: {
              marginTop: '2vh',
            },
            key: 'deletedable',
          });
        }
      });
  };

  const handleCancel = () => {
    if (tempForm === animalRescue) {
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
        title={`${editModal ? 'Edit' : 'Add'} Animal Rescues/Shelters`}
        visible={isModalVisible}
        okButtonProps={{ loading }}
        okText={editModal ? 'Update' : 'Save'}
        onOk={form.submit}
        onCancel={handleCancel}
      >
        <Form form={form} onFinish={handleOk}>
          <Form.Item
            label="Other Animal Rescues/Shelters"
            required
            validateStatus={validationStatus.validateStatus}
            help={errorMsg}
          >
            <Input
              key={key}
              ref={(ref) => ref && ref.focus({ cursor: 'end' })}
              value={animalRescue}
              onChange={(e) => {
                handleInput(e.target.value);
                setAnimalRescue(e.target.value);
              }}
              placeholder="Enter Other Animal Rescues/Shelters"
            />
          </Form.Item>
        </Form>
      </Modal>
      <Row style={{ marginBottom: '10px', alignItems: 'center' }}>
        <Col flex={3}>
          <Row justify="end">
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
          tableType="Other Animal Rescues/Shelters"
          tableData={AnimalRescueList}
          isLoading={false}
          columnData={[{
            title: 'Other Animal Rescues/Shelters',
            dataIndex: 'otherRescueShelterName',
            width: '80%',
          }]}
          delete={handleAnimalHospitalDelete}
          setEditModalOpen={setEditModalOpen}
        />
      </div>
    </>
  );
};

export default AnimalRescues;
