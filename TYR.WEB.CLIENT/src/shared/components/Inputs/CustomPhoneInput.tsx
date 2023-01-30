import { FC, useState } from 'react';
import {
  Input, Form, Select,
} from 'antd';
import NumberFormat from 'react-number-format';

const { Option } = Select;

interface Props {
  phoneNumber: string,
  label: string,
  name: string,
  required: boolean,
  // eslint-disable-next-line no-unused-vars
  setPhoneNumber: (data: any) => void,
}

const CustomPhoneInput: FC<Props> = (newProps) => {
  const {
    phoneNumber, setPhoneNumber, required, label, name,
  } = newProps;
  const [countryCode, setCountryCode] = useState('1');

  const onChangeCountry = (value: any) => {
    setCountryCode(value);
  };

  const onChangeInput = (e: any) => {
    setPhoneNumber(e.target.value);
  };

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

  return (
    <Form.Item
      name={[name]}
      label={label}
      required={required}
      rules={[
        {
          required,
        },
        {
          pattern: /^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]\d{3}[\s.-]\d{4}$/,
          message: 'Please enter valid 10 digit number',
        },
      ]}
    >
      <NumberFormat
        customInput={Input}
        name={name}
        addonBefore={prefixSelector}
        key="phone"
        value={phoneNumber}
        onChange={onChangeInput}
        placeholder="Enter Phone"
        format={`+${countryCode} (###) ###-####`}
      />
    </Form.Item>
  );
};

export default CustomPhoneInput;
