/* eslint-disable no-template-curly-in-string */
import {
  useEffect, useRef, useState, FC,
} from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Button, Input, Form, Row,
} from 'antd';
import { passwordRegex } from '../../shared/validationRegex';
import { InviteProps } from './Invite.types';
import './Invite.less';

const cssPrefix = 'ftr-invite';

// eslint-disable-next-line no-unused-vars
export const Invite: FC<InviteProps> = (newInviteProps) => {
  const {
    getUserDetailByToken, tempUserDetail, updatePasswordInvite, getUserDetailByTokenLoading,
  } = newInviteProps;
  const navigate = useNavigate();
  // eslint-disable-next-line no-unused-vars
  const [userForm, setUserForm] = useState<any>({
    name: '',
    email: '',
    userName: '',
    phoneNumber: '',
  });

  // eslint-disable-next-line no-unused-vars
  const [newKey, setNewKey] = useState(Date.now());
  const titleRef = useRef<HTMLInputElement>(null);
  const [form] = Form.useForm();
  // eslint-disable-next-line no-unused-vars
  const [searchParams, setSearchParams] = useSearchParams();
  const [verificationMessage, setVerificationMessage] = useState<any>('');
  const [firstError, setFirstError] = useState<any>('');

  useEffect(() => {
    titleRef.current?.scrollIntoView();
  }, [titleRef]);

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

  const callbackAfterPasswordUpdate = () => {
    navigate('/login');
  };

  const handleOk = async () => {
    updatePasswordInvite({ ...userForm, token: searchParams.get('token') }, () => { callbackAfterPasswordUpdate(); });
  };

  const callbackAfterGettingDetail = (message: string) => {
    setVerificationMessage(message);
  };

  const handleInput = (e: any) => {
    console.log({ [e.target.name]: e.target.value });
    form.setFieldsValue({ [e.target.name]: e.target.value });
    setUserForm({ ...userForm, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    if (!tempUserDetail) {
      return;
    }
    const {
      id, firstName, lastName, email,
    } = tempUserDetail;
    setUserForm({
      id,
      firstName,
      lastName,
      email,
    });
  }, [tempUserDetail]);

  useEffect(() => {
    const token = searchParams.get('token');
    const email = searchParams.get('email');
    getUserDetailByToken({ token, email }, (message: any) => callbackAfterGettingDetail(message));
    setFirstError('firstName');
  }, []);

  return (
    <div className={`${cssPrefix}`} ref={titleRef}>
      {(!getUserDetailByTokenLoading && !tempUserDetail)
        ? (<Row justify="center"><p style={{ color: 'red' }}>{verificationMessage || 'Link Expired'}</p></Row>)
        : (
          <Row justify="center">
            <Form style={{ width: '600px', color: 'red' }} labelCol={{ span: 7 }} wrapperCol={{ span: 30 }} key={newKey} onFinish={handleOk} form={form} validateMessages={validateMessages}>
              <Form.Item
                label="First Name"
                required
              >
                <Input
                  onClick={() => setFirstError('')}
                  ref={(ref) => (firstError === 'firstName') && ref && ref.focus()}
                  onChange={(e) => handleInput(e)}
                  value={userForm.firstName}
                  name="firstName"
                />
              </Form.Item>
              <Form.Item
                label="Last Name"
                required
              >
                <Input
                  onClick={() => setFirstError('')}
                  onChange={(e) => handleInput(e)}
                  value={userForm.lastName}
                  name="lastName"
                />
              </Form.Item>
              {/* <Form.Item
                label="Phone"
                required
              >
                <Input
                  onChange={(e) => handleInput(e)}
                  value={userForm.phoneNumber}
                  name="phoneNumber"
                />
              </Form.Item> */}
              <Form.Item
                label="Email"
                required
              >
                <Input
                  onClick={() => setFirstError('')}
                  value={userForm.email}
                  name="email"
                  disabled
                />
              </Form.Item>
              <Form.Item
                label="User Name"
                required
              >
                <Input
                  onClick={() => setFirstError('')}
                  onChange={(e) => handleInput(e)}
                  value={userForm.userName}
                  name="userName"
                />
              </Form.Item>
              <Form.Item
                label="Password"
                name="password"
                hasFeedback
                rules={[
                  {
                    required: true,
                    message: 'Password is required',
                  },
                  {
                    pattern: passwordRegex,
                    message: 'Minimum eight characters, at least one uppercase and one lowercase letter, one number and one special character',
                  },
                ]}
              >
                <Input.Password onClick={() => setFirstError('')} name="password" onChange={(e) => handleInput(e)} />
              </Form.Item>
              <Form.Item
                label="Password Confirmation"
                name="confirmPassword"
                dependencies={['password']}
                hasFeedback
                rules={[
                  { required: true, message: 'Confirm Password is required' },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue('password') === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error('Password mismatch'));
                    },
                  }),
                ]}
              >
                <Input.Password onClick={() => setFirstError('')} autoComplete="new-password" />
              </Form.Item>
              <Row justify="center" style={{ marginBottom: '10px', alignItems: 'center' }}>
                <Button type="primary" htmlType="submit">
                  Update
                </Button>
              </Row>
            </Form>
          </Row>
        )}
    </div>
  );
};
