/* eslint-disable no-use-before-define */
import React, { useState } from 'react';
import { Button, Table, TablePaginationConfig } from 'antd';
import './SharedTable.less';

interface TableProps {
  columns?: any[];
  dataSource?: any[];
  selectedRowKeys?: React.Key[];
  // eslint-disable-next-line
  updateSelectedRows?: (records: any[]) => void;
}

const cssPrefix = 'shared-table';

export const SharedTable = (props: TableProps) => {
  const [selectedRows, setSelectedRows] = useState<React.Key[]>(props.selectedRowKeys || []);

  function itemRender(current: any, type: string, originalElement: any) {
    if (type === 'prev') {
      return <Button>Previous</Button>;
    }
    if (type === 'next') {
      return <Button>Next</Button>;
    }
    // if (type === 'page') { return <Button style={{ display: 'none' }} />; }
    return originalElement;
  }

  const pagination: boolean | TablePaginationConfig = {
    itemRender,
    // hideOnSinglePage: true,
    showQuickJumper: false,
    showSizeChanger: false,
    showTitle: true,
    pageSize: 10,
  };

  // eslint-disable-next-line no-unused-vars
  const rowSelection = {
    hideSelectAll: true,
    selectedRowKeys: selectedRows,
    /* eslint-disable-next-line */
    onChange: (selectedRowKeys: React.Key[], selectedRows: any[]) => {
      setSelectedRows(selectedRowKeys);
      if (props.updateSelectedRows) props.updateSelectedRows(selectedRows);
    },
  };

  return (
    <Table
      className={`${cssPrefix}`}
      columns={props.columns || columns}
      dataSource={props.dataSource || []}
      loading={false}
      pagination={pagination}
    />
  );
};

export default SharedTable;

const columns = [
  {
    title: 'ID',
    dataIndex: 'id',
  },
  {
    title: 'Name',
    dataIndex: 'name',
  },
  {
    title: 'Phone',
    dataIndex: 'phone',
  },
  {
    title: 'Email',
    dataIndex: 'email',
  },
  {
    title: 'Address',
    dataIndex: 'address',
  },
  {
    title: 'Mailing List',
    dataIndex: 'mailingList',
  },
];
