/* eslint-disable no-unused-vars */
/* eslint-disable quotes */
/* eslint-disable quote-props */
import { useState, FC, useEffect } from 'react';
import { AutoComplete } from 'antd';

const { Option } = AutoComplete;

interface Props {
  label?: string;
  options?: any;
  value?: any;
  searchKey?: string;
  setSearchKey?: any;
  placeholder?: string;
  setSearchKeyFinal?: (value: any) => void;
  onChange?: (value: any) => void;
}

// eslint-disable-next-line no-unused-vars
const Complete: FC<Props> = (newProps) => {
  const {
    options, setSearchKey, setSearchKeyFinal, placeholder, searchKey,
  } = newProps;
  const [key, setKey] = useState(Date.now());

  useEffect(() => {
    setKey(Date.now());
  }, []);

  return (
    <AutoComplete style={{ width: 200 }} value={searchKey} onChange={(data) => setSearchKey(data)} onSelect={setSearchKeyFinal} placeholder={placeholder}>
      {options?.map((data: any) => (
        <Option key={data} value={data}>
          {data}
        </Option>
      ))}
    </AutoComplete>
  );
};

export default Complete;
