import { useEffect, useRef, useState } from 'react';
import {
  Modal, Input, Row, Col, Form, Button, message,
} from 'antd';
import { PlusOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import CustomTable from '../../../shared/components/CustomTable';
import alertConstant from '../../../shared/constants/alert.json';
import { apiCall } from '../../../shared/api/apiWrapper';
import { Medicine } from '../Customization.types';

const { confirm } = Modal;

const cssPrefix = 'ftr-customization';

const AnimalMedicine = () => {
  const newItem: Medicine[] = [];
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [errorMsg1, setErrorMsg1] = useState('');
  const [errorMsg2, setErrorMsg2] = useState('');
  const [errorMsg3, setErrorMsg3] = useState('');
  const [errorMsg4, setErrorMsg4] = useState('');
  const [medicineForm, setMedicineForm] = useState<any>({});
  const [validationActive, setValidationActive] = useState(false);
  const [animalMedicineList, setAnimalMedicineList] = useState(newItem);
  const [medicineId, setMedicineId] = useState(0);
  const [editModal, setEditModal] = useState(false);
  const [changeData, setChangeData] = useState(false);
  const [key, setKey] = useState<any>('');
  const [tempForm, setTempForm] = useState<any>('');

  const inputRef = useRef<any>(null);
  const inputRef1 = useRef<any>(null);

  const columnData = [
    {
      title: 'Medicine Name',
      dataIndex: 'medicineName',
      width: '40%',
    },
    {
      title: 'Used For',
      dataIndex: 'usedFor',
      width: '40%',
    },
  ];

  useEffect(() => {
    const data = {};
    apiCall('medicine/get-medicine', 'GET', data)
      .then((resp: any) => {
        if (resp?.data?.success) {
          setAnimalMedicineList(resp?.data?.data?.medicines);
        }
      });
    if (!isModalVisible) {
      setErrorMsg1('');
      setErrorMsg2('');
      setErrorMsg3('');
      setErrorMsg4('');
      setMedicineForm({});
      setMedicineId(0);
      setChangeData(false);
      setValidationActive(false);
    }
    setKey(Date.now());
  }, [changeData, isModalVisible]);

  useEffect(() => {
    inputRef?.current?.focus();
  }, [key]);

  const validationError = () => {
    message.error({
      content: alertConstant.validation_error_massage,
      style: {
        marginTop: '2vh',
      },
      key: 'updatable',
    });
  };

  const validate = (medicineFormData: any): any => {
    let error1 = '';
    let error2 = '';
    if (!medicineFormData.medicineName) {
      error1 = 'Medicine Name is required';
      setErrorMsg1('Medicine Name is required');
      validationError();
    } else if (medicineFormData.medicineName.length > 225) {
      error1 = 'Should be less than 225 characters';
      setErrorMsg1('Should be less than 225 characters');
      validationError();
    } else {
      error1 = '';
      setErrorMsg1('');
    }

    if (!medicineFormData.usedFor) {
      error2 = 'Medicine Used For is required';
      setErrorMsg2('Medicine Used For is required');
      validationError();
    } else if (medicineFormData.usedFor.length > 225) {
      error2 = 'Should be less than 225 characters';
      setErrorMsg2('Should be less than 225 characters');
      validationError();
    } else {
      error2 = '';
      setErrorMsg2('');
    }
    return { error1, error2 };
  };

  const showModal = () => {
    inputRef?.current?.focus();
    setEditModal(false);
    setTempForm({});
    setIsModalVisible(true);
  };

  const handleAnimalMedicineDelete = (id: string) => {
    const data = '';
    apiCall(`medicine/delete-medicine/${id}`, 'PATCH', data)
      .then((resp: any) => {
        if (resp?.data?.success) {
          setChangeData(true);
          message.success({
            content: resp?.data?.message || alertConstant.animal_medicine_delete_success,
            style: {
              marginTop: '2vh',
            },
            key: 'deletedable',
          });
        }
      });
  };

  const setEditModalOpen = (value: boolean, data: any) => {
    setMedicineForm(data);
    setMedicineId(data.id);
    setTempForm(data);
    setChangeData(data);
    setEditModal(value);
    setIsModalVisible(value);
  };

  const updateMedicine = () => {
    apiCall(`medicine/update-medicine/${medicineId}`, 'POST', medicineForm)
      .then((respUpdate: any) => {
        if (respUpdate?.data?.success) {
          setChangeData(true);
          message.success({
            content: respUpdate?.data?.message || alertConstant.animal_medicine_update_success,
            style: {
              marginTop: '2vh',
            },
            key: 'updatable',
          });
        }
      });
  };

  const handleOk = async () => {
    if (errorMsg1 === '' && errorMsg2 === '') {
      inputRef?.current?.focus();
    } else if (errorMsg1 !== '' && errorMsg2 === '') {
      inputRef?.current?.focus();
    } else {
      inputRef1?.current?.focus();
    }
    if (editModal && (JSON.stringify(tempForm?.medicineName) === JSON.stringify(medicineForm?.medicineName))) {
      setIsModalVisible(false);
      setEditModal(false);
      updateMedicine();
    } else {
      setValidationActive(true);
      const validateStatus = validate(medicineForm);
      if (validateStatus.error1 || validateStatus.error2) {
        validate(medicineForm);
        // eslint-disable-next-line no-useless-return
        return;
      }
      const data = {
        medicineForm,
      };
      apiCall(`medicine/available-medicine?medicineName=${medicineForm?.medicineName}`, 'get', data)
        .then((resp: any) => {
          if (resp?.data?.data?.isAvailable) {
            setIsModalVisible(false);
            if (!editModal) {
              apiCall('medicine/create-medicine', 'POST', medicineForm)
                .then((respAdd: any) => {
                  if (respAdd?.data?.success) {
                    setChangeData(true);
                    message.success({
                      content: respAdd?.data?.message || alertConstant.animal_medicine_add_success,
                      style: {
                        marginTop: '2vh',
                      },
                      key: 'updatable',
                    });
                  }
                });
            } else {
              updateMedicine();
            }
          } else {
            message.success({
              content: resp?.data?.message || alertConstant.animal_medicine_duplicate_entry,
              style: {
                marginTop: '2vh',
              },
              key: 'updatable',
            });
            setIsModalVisible(true);
            setValidationActive(false);
            if (!editModal) {
              setEditModal(false);
            } else {
              setEditModal(true);
            }
          }
        });
    }
  };

  const onChangeInput = (e: any) => {
    setMedicineForm({ ...medicineForm, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    if (!validationActive) {
      return;
    }
    validate(medicineForm);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [medicineForm]);

  const handleCancel = () => {
    if (JSON.stringify(tempForm) === JSON.stringify(medicineForm)) {
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
        title={editModal ? 'Edit Medicine' : 'Add Medicine'}
        footer={[
          <Button key="cancel" onClick={handleCancel}>
            Cancel
          </Button>,
          <Button type="primary" key="ok" form="animal-medicine" onClick={handleOk} htmlType="submit">
            {editModal ? 'Update' : 'Save'}
          </Button>,
        ]}
        visible={isModalVisible}
        onCancel={handleCancel}
      >
        <Form id="animal-medicine" labelCol={{ span: 8 }} wrapperCol={{ span: 14 }}>
          <Form.Item
            label="Name"
            required
            validateStatus={errorMsg1 ? 'error' : 'success'}
            help={errorMsg1}
            style={{ marginBottom: '0px' }}
          >
            <Input
              key={key}
              ref={inputRef}
              value={medicineForm.medicineName}
              name="medicineName"
              onChange={(e) => onChangeInput(e)}
              placeholder="Enter Medicine Name"
            />
          </Form.Item>
          <Form.Item
            label="Used For"
            required
            validateStatus={errorMsg2 ? 'error' : 'success'}
            help={errorMsg2}
            style={{ marginBottom: '0px' }}
          >
            <Input
              key={key}
              ref={inputRef1}
              value={medicineForm.usedFor}
              name="usedFor"
              onChange={(e) => onChangeInput(e)}
              placeholder="Enter Used For"
            />
          </Form.Item>
          <Form.Item
            label="Formulation"
            validateStatus={errorMsg3 ? 'error' : 'success'}
            help={errorMsg3}
            style={{ marginBottom: '0px' }}
          >
            <Input.TextArea
              value={medicineForm.formulation}
              name="formulation"
              onChange={(e) => onChangeInput(e)}
              placeholder="Enter Formulation"
            />
          </Form.Item>
          <Form.Item
            label="Notes"
            validateStatus={errorMsg4 ? 'error' : 'success'}
            help={errorMsg4}
          >
            <Input.TextArea
              value={medicineForm.notes}
              name="notes"
              onChange={(e) => onChangeInput(e)}
              placeholder="Enter Notes"
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
          tableData={animalMedicineList}
          tableType="Animal Medicine"
          isLoading={false}
          columnData={columnData}
          delete={handleAnimalMedicineDelete}
          setEditModalOpen={setEditModalOpen}
        />
      </div>
    </>
  );
};

export default AnimalMedicine;
