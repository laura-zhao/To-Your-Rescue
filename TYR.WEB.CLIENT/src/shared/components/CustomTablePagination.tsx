/* eslint-disable no-unused-vars */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable no-console */
import { useState, FC, useEffect } from 'react';
import {
  Table, Form, Typography, Modal, Row, Col, Collapse, Pagination,
} from 'antd';
import {
  EditOutlined, DeleteOutlined, ExclamationCircleOutlined, LoadingOutlined,
} from '@ant-design/icons';
import { pageLength } from '../constants/pagination.json';

const { confirm } = Modal;

interface Item {

}

interface Props {
  config: any,
  tableData: Item[];
  columnData: any,
  isLoading: boolean,
  totalNumber: number,
  currentPage: number,
  setPaginationData: (pageNo: number) => void,
  // eslint-disable-next-line no-unused-vars
  delete: (id: string) => void;
  // eslint-disable-next-line no-unused-vars
  setEditModalOpen: (value: boolean, data: any) => void
}

// eslint-disable-next-line no-shadow
const CustomTablePagination: FC<Props> = (Props) => {
  const {
    tableData, columnData, isLoading, totalNumber, currentPage, setPaginationData, config,
  } = Props;
  const {
    selectable, showHeader, isNotEditable, isNotDeletable, isNotEditableBlur, deleteConfirmationData, getDeleteConfirmationDetail,
  } = config;
  const [form] = Form.useForm();
  const [data, setData] = useState(tableData);
  const [currentRecord, setCurrentRecord] = useState({});
  const [editingKey, setEditingKey] = useState('');
  const { Panel } = Collapse;
  const edit = (record: Item) => {
    Props.setEditModalOpen(true, record);
  };

  useEffect(() => {
    setData(tableData);
    setCurrentRecord(tableData[0]);
  }, [tableData]);

  const setNextPage = () => {
    if ((totalNumber / pageLength) === currentPage) {
      return;
    }
    setPaginationData(currentPage + 1);
  };

  const setPreviousPage = () => {
    if (currentPage === 1) {
      return;
    }
    setPaginationData(currentPage - 1);
  };

  const cancel = () => {
    setEditingKey('');
  };

  const itemRender = (current: any, type: any, originalElement: any) => {
    if (type === 'prev') {
      return <a style={{ marginRight: '10px' }} onClick={setPreviousPage}>Previous</a>;
    } if (type === 'next') {
      return <a onClick={setNextPage}>Next</a>;
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
        {deleteConfirmationData && (deleteConfirmationData.milestoneRecords > 2) && (
          <Row justify="center" style={{ backgroundColor: '#e3e1dc' }}>
            <Col span={12}>
              <b>Milestone Records</b>
            </Col>
            <Col span={2}>-</Col>
            <Col span={2}>
              {deleteConfirmationData.milestoneRecords}
            </Col>
          </Row>
        )}
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

  useEffect(() => {
    if (getDeleteConfirmationDetail && deleteConfirmationData) {
      showConfirmModal(currentRecord);
    }
  }, [deleteConfirmationData]);

  const columns = [
    ...columnData,
    {
      title: 'Action',
      dataIndex: 'operation',
      width: isNotDeletable ? '5%' : '15%',
      render: (_: any, record: any) => (
        <Row justify="start" style={{ display: 'inline-flex' }}>
          <Typography.Link style={{ marginRight: '10px', marginLeft: '5px' }} disabled={record.isNotEditable || isNotEditable} onClick={() => edit(record)}>
            <EditOutlined />
          </Typography.Link>
          {!isNotDeletable && (
            <Typography.Link
              disabled={record.isNotEditable || isNotEditableBlur}
              onClick={() => {
                setCurrentRecord(record);
                getDeleteConfirmationDetail ? getDeleteConfirmationDetail(record.id) : showConfirmModal(record);
              }}
            >
              <span style={{ marginLeft: '15px' }}><DeleteOutlined /></span>
            </Typography.Link>
          )}
        </Row>
      ),
    },
  ];

  const rowSelectionSingle = selectable ? {
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

  const rowSelectionMultiple = selectable ? {
    rowSelection: {
      selectedRowKeys: config?.selectedRow,
      type: 'checkbox',
      onChange: (selectedRowKeys: React.Key[], selectedRows: any[]) => {
        console.log(selectedRows, '-----------------', config?.selectedRow, '-----', selectedRowKeys);

        if (config?.selectedRow === selectedRows?.[0]?.id) {
          config.setSelectedRow(selectedRowKeys);
        } else {
          config.setSelectedRow(selectedRowKeys);
        }
      },
      getCheckboxProps: (record: any) => ({
        disabled: record.name === 'Disabled User', // Column configuration not to be checked
        name: record.name,
        className: 'checkbox-thik-change',
      }),
    },
  } : {};

  const rowSelectionData: any = (config?.rowSelection === 'radio') ? rowSelectionSingle : rowSelectionMultiple;

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
              showSizeChanger: false,
              onChange: cancel,
              total: totalNumber,
              pageSize: pageLength,
              itemRender,
            }}
            showHeader={showHeader}
            // eslint-disable-next-line react/jsx-props-no-spreading
            {...rowSelectionData}
          />
        </Form>
      </div>
    </>
  );
};

export default CustomTablePagination;
