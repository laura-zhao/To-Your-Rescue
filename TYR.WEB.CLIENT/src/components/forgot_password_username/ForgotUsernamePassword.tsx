/* eslint-disable no-unused-vars */
/* eslint-disable no-template-curly-in-string */
import {
  useEffect, useRef, FC, useState,
} from 'react';
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import {
  Row, Col, Button, Form, Input,
} from 'antd';
import ButtonLoader from '../../shared/components/ButtonLoader';
import { InviteProps } from './ForgotUsernamePassword.types';
import './ForgotUsernamePassword.less';

const cssPrefix = 'ftr-forgot';

// eslint-disable-next-line no-unused-vars
export const ForgotUsernamePassword: FC<InviteProps> = (newInviteProps) => {
  const {
    forgotUsername,
    forgotPassword,
    forgotUsernameLoading,
    forgotPasswordLoading,
  } = newInviteProps;
  const [form] = Form.useForm();
  const [hideFormMessage, setHideFormMessage] = useState<any>(false);
  const [pageType, setPageType] = useState<any>('');
  const navigate = useNavigate();
  const location = useLocation();

  const titleRef = useRef<HTMLInputElement>(null);
  // eslint-disable-next-line no-unused-vars
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    titleRef.current?.scrollIntoView();
  }, [titleRef]);

  useEffect(() => {
    setPageType(location?.pathname?.split('-')[1]);
  }, [location]);

  const onFinish = () => {
    const email = form.getFieldValue('emailAddress');
    const username = form.getFieldValue('username');
    if ((pageType === 'password')) {
      forgotPassword({ email, username }, (messageData: string) => {
        setHideFormMessage(messageData);
      });
    } else {
      forgotUsername({ email }, (messageData: string) => {
        setHideFormMessage(messageData);
      });
    }
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
        {hideFormMessage ? (
          <div style={{ textAlign: 'center', marginTop: '100px' }}>{hideFormMessage}</div>
        ) : (
          <>
            <Form.Item
              label="Email Address"
              name="emailAddress"
              rules={[
                { required: true, message: 'Email address is required' },
                { type: 'email', message: 'Invalid Email Address' },
              ]}
            >
              <Input placeholder="Email Address" />
            </Form.Item>
            {(pageType === 'password') && (
              <Form.Item
                label="User Name"
                name="username"
                rules={[
                  { required: true, message: 'User name is required' },
                ]}
              >
                <Input placeholder="User Name" />
              </Form.Item>
            )}
            <Row justify="center">
              <Button className={`${cssPrefix}__form__submit`} type="primary" htmlType="submit">
                Submit
                {(forgotUsernameLoading || forgotPasswordLoading) && <ButtonLoader />}
              </Button>
            </Row>
          </>
        )}
        <br />
        <Row justify="center">
          <Button onClick={() => navigate('/login')} className={`${cssPrefix}__form__submit`}>
            BACK TO LOGIN
            {false && <ButtonLoader />}
          </Button>
        </Row>
      </Form>
    </div>
  );
};
