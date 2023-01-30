/* eslint-disable no-unused-vars */
/* eslint-disable no-template-curly-in-string */
import {
  useEffect, FC, useState, useRef,
} from 'react';
import {
  Modal, Input, Form, message,
} from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import alertConstant from '../../../shared/constants/alert.json';
import MultiSelect from '../../../shared/components/Inputs/MultiSelect';
// eslint-disable-next-line no-unused-vars
import CustomPhoneInput from '../../../shared/components/Inputs/CustomPhoneInput';

const { confirm } = Modal;

// eslint-disable-next-line no-unused-vars
const cssPrefix = 'ftr-users';

interface Props {
  tempForm: {},
  isModalVisible: boolean,
  editModal: boolean,
  viewInactive: boolean,
  inviteUserLoading: boolean,
  userForm: any,
  setUserForm: (formData: object) => void,
  setEditModal: (isTrue: boolean) => void,
  setIsModalVisible: (status: boolean) => void,
  getUserListCall: (data: any, callbackFunction: any) => void,
  onSubmit: (data: object, callbackFunction: any) => void,
}

const AddUserForm: FC<Props> = (newProps) => {
  const {
    tempForm, isModalVisible, editModal, viewInactive, setEditModal,
    setIsModalVisible, userForm, setUserForm, onSubmit, getUserListCall,
    inviteUserLoading,
  } = newProps;

  const [key, setKey] = useState<any>('');
  const [newKey, setNewKey] = useState(Date.now());
  const [form] = Form.useForm();

  const inputRef = useRef<any>(null);
  const permissionConstant = [{ id: 'Administrator', label: 'Administrator' }, { id: 'Regular', label: 'Regular' }];

  useEffect(() => {
    inputRef?.current?.focus();
  }, [key]);

  useEffect(() => {
    if (!isModalVisible && !editModal) {
      setNewKey(Date.now());
      form.resetFields();
      form.setFieldsValue({ role: permissionConstant[0]?.label });
      setUserForm({ role: permissionConstant[0]?.label });
    } else {
      setUserForm({ ...userForm, role: permissionConstant[0]?.label });
    }
    setKey(Date.now());
  }, [isModalVisible]);

  useEffect(() => {
    form.setFieldsValue({ ...userForm, role: userForm.role });
  }, [userForm]);

  const validateMessages = {
    required: '${label} is required',
    types: {
      email: '${label} is not a valid email',
      number: '${label} is not a valid number',
    },
    number: {
      range: '${label} must be between ${min} and ${max}',
    },
  };

  const callbackFunction = () => {
    message.success({
      content: editModal ? alertConstant.user_update_success : alertConstant.user_invite_success,
      style: {
        marginTop: '2vh',
      },
      key: 'updatable',
    });
    form.resetFields();
    setEditModal(false);
    setIsModalVisible(false);
    getUserListCall(viewInactive, () => console.log('------'));
  };

  const handleOk = async () => {
    if (!editModal) {
      const updateData = {
        firstName: userForm?.firstName,
        lastName: userForm?.lastName,
        email: userForm?.email,
        roleName: userForm?.role,
      };
      onSubmit(updateData, () => callbackFunction());
    } else {
      const updateData = {
        id: userForm?.id,
        firstName: userForm?.firstName,
        lastName: userForm?.lastName,
        role: userForm?.role,
        email: userForm?.email,
      };
      onSubmit(updateData, () => callbackFunction());
    }
  };

  const handleInput = (e: any) => {
    form.setFieldsValue({ [e.target.name]: e.target.value });
    setUserForm({ ...userForm, [e.target.name]: e.target.value });
  };

  // eslint-disable-next-line no-unused-vars
  const setPhoneNumber = (value: any) => {
    form.setFieldsValue({ phoneNumber: value });
    setUserForm({ ...userForm, phoneNumber: value });
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setEditModal(false);
    return;
    // eslint-disable-next-line no-unreachable
    if (tempForm === JSON.stringify(userForm) || !editModal) {
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
        title={editModal ? 'Edit User Detail' : 'Invite User'}
        visible={isModalVisible}
        okButtonProps={{ loading: inviteUserLoading }}
        onOk={form.submit}
        okText={editModal ? 'Update' : 'Invite'}
        onCancel={handleCancel}
      >
        <Form labelCol={{ span: 6 }} wrapperCol={{ span: 16 }} key={newKey} onFinish={handleOk} form={form} validateMessages={validateMessages}>
          {/* <Form.Item
            name={['username']}
            label="User Name"
            required
            rules={[{ required: true }]}
          >
            <Input
              disabled={editModal}
              key={key}
              ref={inputRef}
              name="username"
              onChange={(e) => handleInput(e)}
              placeholder="Enter User Name"
            />
          </Form.Item> */}
          <Form.Item
            name={['firstName']}
            label="First Name"
            required
            rules={[{ required: true }]}
          >
            <Input
              name="firstName"
              onChange={(e) => handleInput(e)}
              placeholder="Enter First Name"
            />
          </Form.Item>
          <Form.Item
            name={['lastName']}
            label="Last Name"
            required
            rules={[{ required: true }]}
          >
            <Input
              name="lastName"
              onChange={(e) => handleInput(e)}
              placeholder="Enter Last Name"
            />
          </Form.Item>
          <Form.Item
            name={['email']}
            label="Email"
            required
            rules={[{ type: 'email', required: true }]}
          >
            <Input
              name="email"
              onChange={(e) => handleInput(e)}
              placeholder="Enter Email"
            />
          </Form.Item>
          {/* <CustomPhoneInput phoneNumber={userForm?.phoneNumber} setPhoneNumber={(e) => setPhoneNumber(e)} /> */}
          <Form.Item
            name={['role']}
            label="Role"
            required
            rules={[{ required: true }]}
          >
            <MultiSelect
              label="Select Permission Role"
              options={permissionConstant.map((data) => ({ label: data.label, value: data.id }))}
              value={{ id: 'Regular', label: 'Regular' }}
              onChange={(data) => setUserForm({
                ...userForm,
                role: data,
              })}
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default AddUserForm;
