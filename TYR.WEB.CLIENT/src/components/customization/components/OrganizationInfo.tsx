/* eslint-disable no-template-curly-in-string */
import { useEffect, useState } from 'react';
import {
  Input, Row, Col, Form, Button, message, Select, Modal,
} from 'antd';
import { kebabCase } from 'lodash';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import NumberFormat from 'react-number-format';
import alertConstant from '../../../shared/constants/alert.json';

import { apiCall } from '../../../shared/api/apiWrapper';

const { confirm } = Modal;

const { Option } = Select;

type ValidateStatus = Parameters<typeof Form.Item>[0]['validateStatus'];

interface Item {
  id: string;
  volunteerActivity: string;
}

interface CountryNameInterface {
  id: string;
  countryName: string;
}

const OrganizationInfo = () => {
  const newItem: Item[] = [];
  const newCountryNameInterface: CountryNameInterface[] = [];
  const [organizationInfo, setOrganizationInfo] = useState(Object);
  const [tenentId, setTenentId] = useState(0);
  const [countryCode, setCountryCode] = useState('1');
  const [countryName, setCountryName] = useState(newCountryNameInterface);
  // eslint-disable-next-line
  const [selectCountry, setSelectCountry] = useState('');
  // eslint-disable-next-line
  const [selectCountryId, setSelectCountryId] = useState('');
  const [editForm, setEditForm] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [validationStatus, setValidationStatus] = useState<{ validateStatus?: ValidateStatus; }>({});
  // eslint-disable-next-line
  const [volunteerActivitiesList, setOrganizationInfoList] = useState(newItem);
  // eslint-disable-next-line
  const [searchAnimalTypeList, setSearchAnimalTypeList] = useState(newItem);
  const [editData, setEditData] = useState(false);
  const [highlightKey, setHighlightKey] = useState<any>('');
  const [firstError, setFirstError] = useState<any>();
  const [tempForm, setTempForm] = useState({});
  // eslint-disable-next-line no-unused-vars
  const [newKey, setNewKey] = useState(Date.now());
  const [form] = Form.useForm();

  useEffect(() => {
    const data = {};
    apiCall('country/get-country', 'GET', data)
      .then((resp: any) => {
        if (resp?.data?.success) {
          setCountryName(resp?.data?.data?.countries);
        }
      });
  }, []);

  useEffect(() => {
    let errorField = '';
    setTimeout(() => {
      form.getFieldsError()?.map((data: any) => {
        if (errorField) {
          return '';
        }
        if (data?.errors[0]) {
          errorField = data?.name[0];
          setFirstError(data?.name[0]);
        }
        return '';
      });
    }, 500);
  }, [highlightKey]);

  const validationCheck = () => {
    let errorField = '';
    setFirstError('');
    setTimeout(() => {
      form.getFieldsError()?.map((data: any) => {
        if (errorField) {
          return '';
        }
        if (data?.errors[0]) {
          errorField = data?.name[0];
          setFirstError(data?.name[0]);
        }
        return '';
      });
    }, 500);
  };

  // useEffect(() => {
  //   // eslint-disable-next-line
  //   console.log(countryName, organizationInfo?.countryId, 'ddddddd');
  //   // eslint-disable-next-line
  //   const selectedCountryName = countryName.find(o => o.id == organizationInfo.countryId);
  //   setOrganizationInfo({ ...organizationInfo, countryId: selectedCountryName?.countryName });
  //   console.log(selectedCountryName, 'selectedCountryName');
  // }, [organizationInfo.countryId]);

  useEffect(() => {
    const data = {};
    setSelectCountry('');
    apiCall('tenant/get-tenant-info', 'GET', data)
      .then((resp: any) => {
        if (resp?.data?.success) {
          form.setFieldsValue(resp?.data?.data?.tenant);
          // setOrganizationInfo(resp?.data?.data?.tenant);
          setTenentId(resp?.data?.data?.id);
          // eslint-disable-next-line
          const selectedCountryName = countryName.find(o => o.id == resp?.data?.data?.tenant.countryId);
          setOrganizationInfo({ ...resp?.data?.data?.tenant, countryId: selectedCountryName?.countryName });
          console.log(selectedCountryName, 'selectedCountryName');
        }
      });
    if (!editData) {
      setEditData(false);
    }
  }, [editData]);

  const onChangeCountry = (value: any) => {
    setCountryCode(value);
  };

  const onFinishFailed = () => {
    message.error({
      content: alertConstant.validation_error_massage,
      style: {
        marginTop: '2vh',
      },
      key: 'updatable',
    });
  };

  const submitForm = async () => {
    console.log(organizationInfo, 'dfsssssssss');
    const updatedData = {
      name: organizationInfo?.name,
      city: organizationInfo?.city,
      countryId: selectCountry !== '' ? selectCountry : localStorage.getItem('countryId'),
      emailAddress: organizationInfo?.emailAddress,
      phone: organizationInfo?.phone,
      tenantAcronym: organizationInfo?.tenantAcronym,
      state: organizationInfo?.state,
      street: organizationInfo?.street,
      website: organizationInfo?.website,
      zip: organizationInfo?.zip,
    };
    if (editForm) {
      apiCall(`tenant/update-tenant/${tenentId}`, 'post', updatedData)
        .then((resp: any) => {
          if (resp?.data?.success) {
            setEditData(false);
            localStorage.setItem('countryId', (updatedData?.countryId || ''));
            message.success({
              content: resp?.data?.message || alertConstant.organization_info_update_success,
              style: {
                marginTop: '2vh',
              },
              key: 'updatable',
            });
          }
        });
    }
    setEditForm(!editForm);
    setNewKey(Date.now());
  };

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

  const onChangeInput = (e: any) => {
    setOrganizationInfo({ ...organizationInfo, [e.target.name]: e.target.value });
  };

  const onChangeDropDown = (e: any) => {
    setSelectCountry(e);
  };

  // eslint-disable-next-line no-unused-vars
  const prefixSelector = (
    <Select
      value={countryCode}
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

  const onClickEdit = () => {
    setEditForm(true);
    setEditData(true);
    setTempForm({ ...organizationInfo });
  };

  const handleCancel = () => {
    if (JSON.stringify(tempForm) === JSON.stringify(organizationInfo)) {
      setEditForm(false);
      setNewKey(Date.now());
      return;
    }
    confirm({
      title: 'Do you want to save your changes?',
      icon: <ExclamationCircleOutlined />,
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk() {
        form.submit();
      },
      onCancel() {
        setNewKey(Date.now());
        setEditForm(false);
      },
    });
  };

  return (
    <div style={{ marginTop: '30px' }}>
      <Form
        id="organization-form"
        onFinish={submitForm}
        form={form}
        labelCol={{ span: 10 }}
        wrapperCol={{ span: 19 }}
        onFinishFailed={onFinishFailed}
        scrollToFirstError
        validateMessages={validateMessages}
      >
        <Row>
          <Col lg={12}>
            <Form.Item
              name={['name']}
              label="Organization Name"
              required
              rules={[{ required: true }]}
            >
              <Input
                onClick={() => setFirstError('')}
                name="name"
                ref={(ref) => (firstError === 'name') && ref && ref.focus()}
                disabled={!editForm}
                key="name"
                onChange={onChangeInput}
                placeholder="Enter Organization Name"
              />
            </Form.Item>
            <Form.Item
              name={['tenantAcronym']}
              label="Rescue Acronym"
              required
              rules={[{ required: true }]}
            >
              <Input
                onClick={() => setFirstError('')}
                name="tenantAcronym"
                ref={(ref) => (firstError === 'tenantAcronym') && ref && ref.focus()}
                disabled={!editForm}
                key="tenantAcronym"
                onChange={onChangeInput}
                placeholder="Enter Rescue Acronym"
              />
            </Form.Item>
            <Form.Item
              name={['street']}
              label="Street"
              required
              rules={[{ required: true }]}
            >
              <Input
                onClick={() => setFirstError('')}
                name="street"
                disabled={!editForm}
                ref={(ref) => (firstError === 'street') && ref && ref.focus()}
                key="street"
                onChange={onChangeInput}
                placeholder="Enter Street"
              />
            </Form.Item>
            <Form.Item
              name={['city']}
              label="City"
              required
              rules={[{ required: true }]}
            >
              <Input
                onClick={() => setFirstError('')}
                name="city"
                disabled={!editForm}
                ref={(ref) => (firstError === 'city') && ref && ref.focus()}
                key="city"
                onChange={onChangeInput}
                placeholder="Enter City"
              />
            </Form.Item>
            <Form.Item
              name={['state']}
              label="State, Province, or Locality"
              required
              rules={[
                { required: true },
                {
                  pattern: /^.{1,2}$/,
                  message: 'State must not be more than two characters',
                },
              ]}
            >
              <Input
                onClick={() => setFirstError('')}
                name="state"
                disabled={!editForm}
                ref={(ref) => (firstError === 'state') && ref && ref.focus()}
                key="state"
                onChange={onChangeInput}
                placeholder="Enter State, Province, or Locality"
              />
            </Form.Item>
            <Form.Item
              name={['zip']}
              label="Zip/Postal Code"
              required
              rules={[{ required: true }, { pattern: /^\d{5}[-\s]?(?:\d{4})?$/, message: 'Please enter valid zip' }]}
            >
              <Input
                onClick={() => setFirstError('')}
                name="zip"
                disabled={!editForm}
                ref={(ref) => (firstError === 'zip') && ref && ref.focus()}
                key="zip"
                onChange={onChangeInput}
                placeholder="Enter Zip"
              />
            </Form.Item>
            {/* <Input.Group>
              <Row gutter={8}>
                <Col span={12}>
                  <Form.Item
                    name={['countryCode']}
                    label="Country Code"
                    required
                    rules={[{ required: true }, { pattern: /^[a-zA-Z]{1,3}$/, message: 'Max 3 letters are required' }]}
                  >
                    <Input
                      name="countryCode"
                      disabled={!editForm}
                      key="countryCode"
                      value={organizationInfo?.countryCode}
                      onChange={onChangeInput}
                      placeholder="Enter Country Code"
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name={['country']}
                    label="Country Name"
                    required
                    rules={[
                      {
                        required: true,
                      },
                    ]}
                  >
                    <Input
                      disabled={!editForm}
                      name="country"
                      key="countryName"
                      onChange={onChangeInput}
                      placeholder="Enter Country Name"
                    />
                  </Form.Item>
                </Col>
              </Row>
            </Input.Group> */}
            <Form.Item
              name="countryId"
              key="countryId"
              label="Country"
              required
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <Select
                onChange={onChangeDropDown}
                disabled={!editForm}
                showSearch
                filterOption={(input, option) => option?.children.toLowerCase().startsWith(input.toLowerCase())}
              >
                {countryName?.map((data) => (
                  <Option key={kebabCase(data.id)} value={data?.id}>{data?.countryName}</Option>
                ))}
              </Select>
              {/* <Input
                disabled={!editForm}
                name="country"
                key="countryName"
                onChange={onChangeInput}
                placeholder="Enter Country"
              /> */}
            </Form.Item>
          </Col>
          <Col lg={12}>
            <Form.Item
              name={['phone']}
              label="Phone"
              required
              rules={[
                {
                  required: true,
                },
                {
                  pattern: /^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]\d{3}[\s.-]\d{4}$/,
                  message: 'Please enter valid 10 digit number',
                },
              ]}
            >
              <NumberFormat
                onClick={() => setFirstError('')}
                customInput={Input}
                addonBefore={prefixSelector}
                disabled={!editForm}
                key="phone"
                name="phone"
                onChange={onChangeInput}
                placeholder="Enter Phone"
                format={`+${countryCode} (###) ###-####`}
              />
            </Form.Item>
            <Form.Item
              name={['emailAddress']}
              label="Email"
              required
              rules={[{ type: 'email', required: true }]}
            >
              <Input
                onClick={() => setFirstError('')}
                name="emailAddress"
                ref={(ref) => (firstError === 'emailAddress') && ref && ref.focus()}
                disabled={!editForm}
                key="email"
                onChange={onChangeInput}
                placeholder="Enter Email"
              />
            </Form.Item>
            <Form.Item
              name={['website']}
              label="Website URL"
              required
              rules={[
                {
                  required: true,
                },
                {
                  pattern: /(www\.)?[-a-zA-Z0-9@:%._~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_.~#?&//=]*)/,
                  message: 'Please enter valid website url',
                },
              ]}
            >
              <Input
                onClick={() => setFirstError('')}
                name="website"
                ref={(ref) => (firstError === 'website') && ref && ref.focus()}
                key="website"
                disabled={!editForm}
                onChange={onChangeInput}
                placeholder="Enter Website URL"
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
      <div style={{ marginTop: '0px' }}>
        <Row style={{ marginBottom: '10px', alignItems: 'center' }}>
          <Col flex={3}>
            <Row justify="start" style={{ width: '200px' }}>
              {/* <Input */}
              {/*    onChange={(e)=>onSearch(e.target.value)} */}
              {/*    placeholder="Search Animal Type"/> */}
            </Row>
          </Col>
          <Col flex={3}>
            <Row justify="end">
              {editForm
                ? (
                  <>
                    <Col lg={4}>
                      <Button type="primary" onClick={() => handleCancel()}>
                        Cancel
                      </Button>
                    </Col>
                    <Col lg={4}>
                      <Button
                        form="organization-form"
                        type="primary"
                        htmlType="submit"
                        onClick={() => {
                          validationCheck();
                          setHighlightKey(Date.now());
                          form.submit();
                        }}
                      >
                        Save
                      </Button>
                    </Col>
                  </>
                )
                : (
                  <Col lg={4}>
                    <Button type="primary" onClick={onClickEdit}>
                      Edit
                    </Button>
                  </Col>
                )}
            </Row>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default OrganizationInfo;
