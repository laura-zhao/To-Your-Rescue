import { FC } from 'react';
import { Select } from 'antd';

interface Props {
  label: string;
  options: any;
  value: any;
  // eslint-disable-next-line
  onChange: (value: any) => void
}

const MultiSelect: FC<Props> = (newProps) => {
  const {
    label, options, value, onChange,
  } = newProps;
  console.log(value);
  return (
    <Select
      placeholder={label}
      showArrow
      value={value}
      style={{ width: '100%' }}
      options={options}
      key="value"
      onChange={(data) => {
        onChange(data);
      }}
    />
  );
};

export default MultiSelect;
