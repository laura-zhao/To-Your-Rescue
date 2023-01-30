/* eslint-disable no-template-curly-in-string */
import {
  useEffect, useRef, FC, useState,
} from 'react';
import { useLocation, useSearchParams, useNavigate } from 'react-router-dom';
import {
  Row, Button, Form, Input,
} from 'antd';
import { passwordRegex } from '../../shared/validationRegex';
import ButtonLoader from '../../shared/components/ButtonLoader';
import './ResetPassword.less';

const cssPrefix = 'ftr-reset-password';
interface ResetPasswordProps {
  resetPassword: any,
  forgotPasswordLoading: boolean,
}

// eslint-disable-next-line no-unused-vars
export const ResetPassword: FC<ResetPasswordProps> = (props) => {
  const { resetPassword, forgotPasswordLoading } = props;
  const [form] = Form.useForm();
  // eslint-disable-next-line no-unused-vars
  const [pageType, setPageType] = useState<any>('');
  const location = useLocation();
  // eslint-disable-next-line no-unused-vars
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const titleRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    titleRef.current?.scrollIntoView();
  }, [titleRef]);

  useEffect(() => {
    setPageType(location?.pathname?.split('-')[1]);
  }, [location]);

  const onFinish = () => {
    const token = searchParams.get('token');
    const email = searchParams.get('email');
    const password = form.getFieldValue('password');
    resetPassword({
      token,
      email,
      password,
    }, () => {
      setInterval(() => {
        navigate('/login');
      }, 1000);
    });
  };

  return (
    <div className={`${cssPrefix}`} ref={titleRef}>
      <Form
        className={`${cssPrefix}__form`}
        name="basic"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 8 }}
        initialValues={{ remember: true }}
        form={form}
        onFinish={onFinish}
        autoComplete="on"
      >
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
          <Input.Password autoComplete="new-password" />
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
          <Input.Password />
        </Form.Item>
        <Row justify="center">
          <Button className={`${cssPrefix}__form__submit`} type="primary" htmlType="submit">
            Reset Password
            {forgotPasswordLoading && <ButtonLoader />}
          </Button>
        </Row>
        <br />
      </Form>
    </div>
  );
};
