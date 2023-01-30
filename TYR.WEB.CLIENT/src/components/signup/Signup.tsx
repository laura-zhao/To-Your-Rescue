/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import {
  useEffect, useState, useRef, FC,
} from 'react';
import { useNavigate } from 'react-router-dom';
import Title from 'antd/lib/typography/Title';
import { kebabCase } from 'lodash';
import {
  Form,
  Input,
  Button,
  Tooltip,
  Typography,
  Select,
  message,
  // Col,
  // Row,
} from 'antd';
import NumberFormat from 'react-number-format';
import { InfoCircleOutlined } from '@ant-design/icons';
import ButtonLoader from '../../shared/components/ButtonLoader';
import { WebsiteValidationTooltip, PhoneValidationTooltip } from '../../shared/constants/tooltips.data';
import { SignupProps } from './Signup.types';

import { apiCall } from '../../shared/api/apiWrapper';
import { passwordRegex } from '../../shared/validationRegex';
import './Signup.less';
import { tyrLogoSrc } from '../../assets/images';

const cssPrefix = 'ftr-signup';

interface CountryNameInterface {
  id: string;
  countryName: string;
}

// eslint-disable-next-line
export const Signup: FC<SignupProps> = (newSignupProps) => {
  const { signupLoading } = newSignupProps;
  const newCountryNameInterface: CountryNameInterface[] = [];
  const [countryCodePhone, setCountryCodePhone] = useState('1');
  // eslint-disable-next-line no-unused-vars
  const [countryCodePhone2, setCountryCodePhone2] = useState('1');
  const [countryName, setCountryName] = useState(newCountryNameInterface);
  // eslint-disable-next-line no-unused-vars
  const [selectCountry, setSelectCountry] = useState('');
  const [mobileView, setMobileView] = useState(window.innerWidth);
  const handleWindowResize = () => {
    setMobileView(window.innerWidth);
  };

  useEffect(() => {
    window.addEventListener('resize', handleWindowResize);
    return () => {
      window.removeEventListener('resize', handleWindowResize);
    };
  }, []);

  useEffect(() => {
    const data = {};
    apiCall('country/get-country', 'GET', data)
      .then((resp: any) => {
        if (resp?.data?.success) {
          setCountryName(resp?.data?.data?.countries);
        }
      });
  }, []);

  // eslint-disable-next-line no-unused-vars
  const navigate = useNavigate();
  const { Option } = Select;
  const [form] = Form.useForm();
  const titleRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    titleRef.current?.scrollIntoView();
  }, [titleRef]);

  // eslint-disable-next-line no-unused-vars
  const onFinish = (values: any) => {
    const {
      alternateEmailAddress,
      city,
      countryId = selectCountry,
      email,
      firstName,
      lastName,
      name,
      password,
      phone,
      emailAddressPerson,
      phoneNumber,
      state,
      street,
      tenantAcronym,
      username,
      Website,
      zip,
    } = form.getFieldsValue();

    // eslint-disable-next-line no-unused-vars
    const formData = {
      username,
      email,
      alternateEmailAddress,
      password,
      firstName,
      lastName,
      phoneNumber,
      status: sessionStorage.getItem('signup-type'),
      tenantVm: {
        name,
        tenantAcronym,
        street,
        city,
        state,
        zip,
        countryId,
        phone,
        emailAddress: emailAddressPerson,
        website: Website,
        mailList: true,
      },
    };
    console.log(formData, 'selectCountry');
    localStorage.setItem('countryId', formData.tenantVm.countryId);
    newSignupProps.signUpCall(formData, () => {
      navigate('/login');
    });
  };

  const onChangeDropDown = (e: any) => {
    setSelectCountry(e);
  };

  // eslint-disable-next-line no-unused-vars
  const onFinishFailed = (errorInfo: any) => {
    message.error('Please correct highlighted fields', 1.5);
  };

  // eslint-disable-next-line
  const pageHeader = (
    <div className={`${cssPrefix}__header-row`}>
      <Title level={3} style={{ margin: '16px 0' }}>
        Signup
      </Title>
    </div>
  );

  const onChangeCountry = (value: any) => {
    setCountryCodePhone(value);
  };

  // eslint-disable-next-line no-unused-vars
  const prefixSelector = (
    <Select
      value={countryCodePhone}
      style={{ width: 70 }}
      showSearch
      placeholder="Select a country"
      optionFilterProp="children"
      onChange={onChangeCountry}
      filterOption={(input, option) => option?.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
    >
      <Option value="1">US</Option>
      <Option value="91">IN</Option>
      <Option value="44">UK</Option>
    </Select>
  );

  const isMobile = mobileView > 600;

  const signupForm = (
    <Form
      className={`${cssPrefix}__form`}
      name="basic"
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 8 }}
      initialValues={{ remember: true }}
      form={form}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      autoComplete="on"
    >
      <img className={`${cssPrefix}__form__img`} style={{ width: '13vh' }} src={tyrLogoSrc} alt="toyourrescue.com" />
      <hr className={`${cssPrefix}__form__hr`} />
      <Title className={`${cssPrefix}__form__header`} level={5}>Your Rescue Information</Title>
      <Form.Item
        label="Rescue Name"
        name="name"
        rules={[{ required: true, message: 'Rescue Name is required' }]}
      >
        <Input placeholder="Your rescue name" />
      </Form.Item>
      <Form.Item
        label="Rescue Acronym"
        name="tenantAcronym"
        rules={[{ required: true, message: 'Rescue Acronym is required' }]}
      >
        <Input placeholder="Your rescue acronym" />
      </Form.Item>
      <Form.Item
        label="Street"
        name="street"
        rules={[{ required: true, message: 'Street Name is required' }]}
      >
        <Input placeholder="Street" />
      </Form.Item>
      <Form.Item
        label="City or Township"
        name="city"
        rules={[{ required: true, message: 'City or Township Name is required' }]}
      >
        <Input placeholder="City or Township Name" />
      </Form.Item>
      <Form.Item
        label="State or Locality Code"
        name="state"
        rules={[
          { required: true, message: 'State or Locality Code is required' },
          {
            pattern: /^.{1,2}$/,
            message: 'State must not be more than two characters',
          },
        ]}
      >
        <Input placeholder="State or Locality Code" />
      </Form.Item>
      {/* <Form.Item
        label="Country Code"
        name="countryCode"
        rules={[{ required: true }, { pattern: /^[a-zA-Z]{1,3}$/, message: 'Max 3 letters are required' }]}
      >
        <Input placeholder="Country" />
      </Form.Item> */}
      <Form.Item
        label="Country"
        name="countryId"
        rules={[{ required: true, message: 'Country name is required' }]}
      >
        <Select
          onChange={onChangeDropDown}
          showSearch
          filterOption={(input, option) => option?.children.toLowerCase().startsWith(input.toLowerCase())}
        >
          {countryName?.map((data) => (
            <Option key={kebabCase(data.id)} value={data?.id}>{data?.countryName}</Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item
        label="Zip/Postal Code"
        name="zip"
      // rules={[{ required: true, message: 'Zip is required' }, { pattern: /^\d{5}[-\s]?(?:\d{4})?$/, message: 'Please enter valid zip' }]}
      >
        <Input placeholder="Zip/Postal Code" />
      </Form.Item>
      <Form.Item
        name="phoneNumber"
        label="Phone"
        rules={[
          {
            pattern: /^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]\d{3}[\s.-]\d{4}$/,
            message: 'Please enter valid 10 digit number',
          },
        ]}
      >
        <div className={`${cssPrefix}__form__inline`}>
          <NumberFormat
            customInput={Input}
            addonBefore={prefixSelector}
            key="phone"
            placeholder="Enter Phone"
            format={`+${countryCodePhone} (###) ###-####`}
          />
          <Tooltip overlayClassName={`${cssPrefix}__form__tooltip`} placement="bottom" title={PhoneValidationTooltip}>
            <Typography.Link><InfoCircleOutlined /></Typography.Link>
          </Tooltip>
        </div>
      </Form.Item>
      <Form.Item
        label="Email Address"
        name="emailAddressPerson"
        rules={[{ type: 'email', message: 'Invalid Email Address' }]}
      >
        <Input placeholder="Email Address" />
      </Form.Item>
      <Form.Item
        label="Website"
        name={['Website']}
        rules={[{
          pattern: /^(https?:\/\/)?((([a-z\d]([a-z\d-]*[a-z\d])*)\.)+[a-z]{2,}|((\d{1,3}\.){3}\d{1,3}))(:\d+)?(\/[-a-z\d%_.~+]*)*(\?[;&a-z\d%_.~+=-]*)?(#[-a-z\d_]*)?$/i,
          message: 'Please enter valid URL',
        }]}
      >
        <div className={`${cssPrefix}__form__inline`}>
          <Input name="website" className={`${cssPrefix}__form__input`} placeholder="Website" />
          <Tooltip overlayClassName={`${cssPrefix}__form__tooltip`} placement="right" title={WebsiteValidationTooltip}>
            <Typography.Link><InfoCircleOutlined /></Typography.Link>
          </Tooltip>
        </div>
      </Form.Item>

      <hr className={`${cssPrefix}__form__hr`} />
      <Title className={`${cssPrefix}__form__header`} level={5}>Your Information</Title>
      <Form.Item
        label="First Name"
        name="firstName"
        rules={[{ required: true, type: 'string', message: 'First Name is required' }]}
      >
        <Input placeholder="First Name" />
      </Form.Item>
      <Form.Item
        label="Last Name"
        name="lastName"
        rules={[{ required: true, type: 'string', message: 'Last Name is required' }]}
      >
        <Input placeholder="Last Name" />
      </Form.Item>
      <Form.Item
        label="User ID"
        name="username"
        rules={[{ required: true, message: 'User Id is required' }]}
      >
        <Input placeholder="User ID" />
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
      <Form.Item
        name="phone"
        label="Phone"
        rules={[
          {
            required: true,
            message: 'Phone is required',
          },
          {
            pattern: /^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]\d{3}[\s.-]\d{4}$/,
            message: 'Please enter valid 10 digit number',
          },
        ]}
      >
        <div className={`${cssPrefix}__form__inline`}>
          <NumberFormat
            customInput={Input}
            addonBefore={prefixSelector}
            key="phone"
            placeholder="Enter Phone"
            format={`+${countryCodePhone} (###) ###-####`}
          />
        </div>
      </Form.Item>
      <Form.Item
        label="Email Address"
        name="email"
        rules={[{ required: true, message: 'Email Address is required' }, { type: 'email', message: 'Email is not a valid email' }]}
      >
        <Input placeholder="Your Email Address" />
      </Form.Item>
      <Form.Item
        label="Alternate Email Address"
        name="alternateEmailAddress"
        rules={[
          { type: 'email', message: 'Email is not a valid email' },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue('email') !== value) {
                return Promise.resolve();
              }
              return Promise.reject(new Error('Alternate Email should not be same as Email Address'));
            },
          }),
        ]}
      >
        <Input placeholder="Alternate Email Address" />
      </Form.Item>
      {
        isMobile
        && (
          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button className={`${cssPrefix}__form__submit`} type="primary" htmlType="submit">
              Submit
              {signupLoading && <ButtonLoader />}
            </Button>
            <div className={`${cssPrefix}__form__signin-instead`}>
              <span>Already have an account? </span>
              <span
                style={{
                  textDecoration: 'underline',
                  color: 'blue',
                  textDecorationColor: 'blue',
                  cursor: 'pointer',
                }}
                onClick={() => navigate('/login')}
              >
                Sign in instead
              </span>
            </div>
            {/* <img className={`${cssPrefix}__form__img`} src={tyrAnimalImgSrc} alt="toyourrescue.com" /> */}
          </Form.Item>
        )
      }
      {
        !isMobile
        && (
          <Form.Item>
            <Button className={`${cssPrefix}__form__submit`} type="primary" htmlType="submit">
              Submit
              {signupLoading && <ButtonLoader />}
            </Button>
            <div className={`${cssPrefix}__form__signin-instead`}>
              <span>Already have an account? </span>
              <span
                style={{
                  textDecoration: 'underline',
                  color: 'blue',
                  textDecorationColor: 'blue',
                  cursor: 'pointer',
                }}
                onClick={() => navigate('/login')}
              >
                Sign in instead
              </span>
            </div>
            {/* <img className={`${cssPrefix}__form__img`} src={tyrAnimalImgSrc} alt="toyourrescue.com" /> */}
          </Form.Item>
        )
      }
    </Form>
  );

  return (
    <div className={`${cssPrefix}`} ref={titleRef}>
      {/* {pageHeader} */}
      {signupForm}
    </div>
  );
};
