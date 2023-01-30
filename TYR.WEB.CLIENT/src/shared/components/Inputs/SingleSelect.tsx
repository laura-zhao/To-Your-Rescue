import React, {FC, useEffect, useState} from 'react';
import {Select, Tag} from 'antd';

// const options = [{value: 'gold'}, {value: 'lime'}, {value: 'green'}, {value: 'cyan'}];

interface Props {
    options: any;
    value: any;
    onChange: (value: any) => void
}

const MultiSelect: FC<Props> = (Props) => {
    let {options, value, onChange} = Props;

    return (
        <Select
            placeholder={'Select Animal Types'}
            showArrow
            value={value}
            style={{width: '100%'}}
            options={options}
            key='value'
            onChange={(data)=>{
                onChange(data);
            }}
        />
    );
}

export default MultiSelect;