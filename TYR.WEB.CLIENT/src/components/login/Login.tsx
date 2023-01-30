/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import {
  useState, useEffect, useRef, FC,
} from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card, Button, Input, Form, Row, Checkbox,
} from 'antd';
import Title from 'antd/lib/typography/Title';
import ButtonLoader from '../../shared/components/ButtonLoader';
import { tyrAnimalImgSrc, tyrLogoSrc } from '../../assets/images';
import { LoginProps } from './Login.types';
import './Login.less';

const cssPrefix = 'ftr-login';

// eslint-disable-next-line no-unused-vars
export const Login: FC<LoginProps> = (newLoginProps) => {
  const { loginLoading } = newLoginProps;

  const [checked, setChecked] = useState(false);
  const navigate = useNavigate();
  const titleRef = useRef<HTMLInputElement>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    titleRef.current?.scrollIntoView();
  }, [titleRef]);

  const onFinish = () => {
    const formData = form.getFieldsValue();
    formData.staySignedIn = checked;
    newLoginProps.loginCall(formData, () => {
      navigate('/');
    });
  };

  return (
    <div className={`${cssPrefix}`} ref={titleRef}>
      <Row justify="center">
        <Card style={{ width: '450px', padding: '0px' }} bodyStyle={{ paddingTop: '2px', paddingLeft: '50px', paddingRight: '50px' }}>
          <Row justify="center">
            <img className={`${cssPrefix}__img_logo`} src={tyrLogoSrc} alt="toyourrescue.com" />
            <Title style={{ fontSize: '25px', color: '#bb142d' }}>Sign in to your account</Title>
          </Row>
          <br />
          <Form layout="vertical" onFinish={onFinish} form={form}>
            <Form.Item
              style={{ marginBottom: '10px' }}
              label="User ID"
              name="userName"
              rules={[{ required: true, message: 'User Id is required' }]}
            >
              <Input placeholder="Enter Your User ID" />
            </Form.Item>
            <Form.Item
              style={{ marginBottom: '10px' }}
              label="Password"
              name="password"
              rules={[{ required: true, message: 'Password is required' }]}
            >
              <Input.Password placeholder="Enter Your Password" />
            </Form.Item>
            <Checkbox onChange={() => setChecked(!checked)} checked={checked}>Stay signed in</Checkbox>
            <Row justify="center" style={{ marginTop: '35px' }}>
              <Form.Item style={{ marginBottom: '10px' }}>
                <Button className={`${cssPrefix}__button`} type="primary" htmlType="submit">
                  Log in
                  {loginLoading && <ButtonLoader />}
                </Button>
              </Form.Item>
            </Row>
          </Form>
          <div>
            {'Forgot your '}
            <span style={{ color: 'blueviolet', cursor: 'pointer', textDecoration: 'underline' }} onClick={() => navigate('/forgot-username')}>username</span>
            {' or '}
            <span style={{ color: 'blueviolet', cursor: 'pointer', textDecoration: 'underline' }} onClick={() => navigate('/forgot-password')}>password</span>
            ?
          </div>
          <br />
          <Row justify="center">
            <img className={`${cssPrefix}__img_animal`} src={tyrAnimalImgSrc} alt="toyourrescue.com" />
          </Row>
        </Card>
      </Row>
    </div>
  );
};
