/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
import { useState, FC, useEffect } from 'react';
import {
  Table, Form, Typography, Modal, Row, Collapse, Pagination,
} from 'antd';
import {
  EditOutlined, DeleteOutlined, ExclamationCircleOutlined, LoadingOutlined,
  SendOutlined,
} from '@ant-design/icons';

const { confirm } = Modal;

interface Item {

}

interface Props {
  config: any,
  tableData: Item[];
  tableType: string,
  columnData: any,
  isLoading: boolean,
  selectable: boolean,
  showHeader: boolean,
  isNotEditable: boolean,
  // eslint-disable-next-line no-unused-vars
  delete: (id: string) => void;
  // eslint-disable-next-line no-unused-vars
  setEditModalOpen: (value: boolean, data: any) => void
}

// eslint-disable-next-line no-shadow
const EditableTable: FC<Props> = (Props) => {
  const {
    // eslint-disable-next-line no-unused-vars
    tableData, tableType, columnData, isLoading, selectable, showHeader, isNotEditable, config,
  } = Props;
  const [form] = Form.useForm();
  const [data, setData] = useState(tableData);
  // eslint-disable-next-line no-unused-vars
  const [editingKey, setEditingKey] = useState('');
  const { Panel } = Collapse;
  const edit = (record: Item) => {
    Props.setEditModalOpen(true, record);
  };

  useEffect(() => {
    setData(tableData);
  }, [tableData]);

  const cancel = () => {
    setEditingKey('');
  };

  const itemRender = (current: any, type: any, originalElement: any) => {
    if (type === 'prev') {
      return <a style={{ marginRight: '10px' }}>Previous</a>;
    } if (type === 'next') {
      return <a>Next</a>;
    }
    return originalElement;
  };

  const deleteItem = async (deleteRecord: any) => {
    Props.delete(deleteRecord?.id);
  };

  const showConfirmModal = async (record: any) => {
    confirm({
      title: 'Are you sure?',
      icon: <ExclamationCircleOutlined />,
      content: <span>
        Are you sure you want to delete
        <b>{` ${record[columnData[0]?.dataIndex] ? record[columnData[0]?.dataIndex] : ''}`}</b>
        ?
      </span>,
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk() {
        deleteItem(record);
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  };

  const columns = [
    ...columnData,
    {
      title: 'Action',
      dataIndex: 'operation',
      width: '15%',
      render: (_: any, record: any) => (
        <Row justify="start" style={{ display: 'inline-flex' }}>
          <Typography.Link style={{ marginRight: '10px', marginLeft: '5px' }} disabled={record.isNotEditable || isNotEditable} onClick={() => edit(record)}>
            <EditOutlined />
          </Typography.Link>
          <Typography.Link disabled={record.isNotEditable || isNotEditable} onClick={() => showConfirmModal(record)}>
            <span style={{ marginLeft: '15px' }}><DeleteOutlined /></span>
          </Typography.Link>
          {config.sendInvitation && (
            (config?.sendLoading === record?.id) ? (
              <Typography.Link>
                <span style={{ marginLeft: '15px' }}><LoadingOutlined spin /></span>
              </Typography.Link>
            ) : (
              <Typography.Link disabled={record?.dateActive} onClick={() => config?.sendInvitation(record)}>
                <span style={{ marginLeft: '15px' }}><SendOutlined /></span>
              </Typography.Link>
            )
          )}
        </Row>
      ),
    },
  ];

  const rowSelection = selectable ? {
    rowSelection: {
      selectedRowKeys: [config?.selectedRow],
      hideSelectAll: (config?.rowSelection === 'radio'),
      onChange: (selectedRowKeys: React.Key[], selectedRows: any[]) => {
        if (config?.selectedRow === selectedRows?.[0]?.id) {
          config.setSelectedRow(selectedRows?.[1]?.id);
        } else {
          config.setSelectedRow(selectedRows?.[0]?.id);
        }
      },
      getCheckboxProps: (record: any) => ({
        disabled: record.name === 'Disabled User', // Column configuration not to be checked
        name: record.name,
        className: 'checkbox-thik-change',
      }),
    },
  } : {};

  return (
    <>
      <div className="mobile-view">
        <Collapse accordion bordered>
          {data?.map?.((currentData, i) => {
            const keyTyped = columns[0]?.dataIndex as keyof typeof currentData;
            return (
              // eslint-disable-next-line react/no-array-index-key
              <Panel style={{ backgroundColor: 'whitesmoke' }} header={columns[0]?.render?.(null, currentData) || currentData[keyTyped]} key={i}>
                {columns.map((colData, j) => {
                  const keyName = columns[j]?.dataIndex as keyof typeof currentData;
                  return (
                    <>
                      {(j !== 0) && <hr className="hr-line" />}
                      <b>{colData.title}</b>
                      {' : '}
                      {colData?.render?.(null, currentData) || currentData[keyName]}
                    </>
                  );
                })}
              </Panel>
            );
          })}
        </Collapse>
        <Row justify="end" style={{ marginTop: '10px' }}>
          <Pagination itemRender={itemRender} showLessItems defaultCurrent={1} total={500} />
        </Row>
      </div>

      <div className="desktop-view">
        <Form form={form} component={false}>
          <Table
            loading={{ indicator: <LoadingOutlined style={{ fontSize: 14 }} spin />, spinning: isLoading }}
            style={{ borderTop: '#820014 1px solid' }}
            dataSource={data}
            columns={columns}
            rowClassName="editable-row"
            rowKey="id"
            pagination={{
              onChange: cancel,
              pageSize: 15,
              itemRender,
            }}
            showHeader={showHeader}
            // eslint-disable-next-line react/jsx-props-no-spreading
            {...rowSelection}
          />
        </Form>
      </div>
    </>
  );
};

export default EditableTable;
