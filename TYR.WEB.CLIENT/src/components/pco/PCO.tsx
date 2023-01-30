/* eslint-disable no-unused-vars */
import { useEffect, useState, FC } from 'react';
import {
  Modal, Select, Space, Switch, Typography, AutoComplete,
} from 'antd';
import {
  QuestionCircleOutlined, CheckOutlined, CloseOutlined, FlagFilled,
} from '@ant-design/icons';
import {
  filterOptions, ORG,
} from './Pco.data';
import {
  TableData, PcoProps, TableFilterTypes,
} from './PCO.types';
import { pcoMock } from './pco-mock';
import { ContentToolbar } from './components/ContentToolbar';
import { PcoAddModal } from './components/PcoAddModal';
import CustomTablePagination from '../../shared/components/CustomTablePagination';
import { pageLength } from '../../shared/constants/pagination.json';
import './PCO.less';

const { Title } = Typography;
const { Option } = Select;
const { confirm } = Modal;

const cssPrefix = 'ftr-pco';

// eslint-disable-next-line
export const PCO: FC<PcoProps> = (newPcoProps) => {
  const [tableData, setTableData] = useState(JSON.parse(JSON.stringify(pcoMock)));
  // eslint-disable-next-line no-unused-vars
  const [filteredTableData, setFilteredTableData] = useState(tableData);
  const [tableFilter, setTableFilter] = useState<TableFilterTypes>(filterOptions[0].id);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [tempForm, setTempForm] = useState({});
  const [editRecord, setEditRecord] = useState(null);
  const [currentPageLocal, setCurrentPageLocal] = useState(1);
  const [searchKey, setSearchKey] = useState('');
  const [searchKeyFinal, setSearchKeyFinal] = useState('');
  const [clickedValue, setClickedValue] = useState(false);

  const {
    getPcoListLoading,
    getPcoListCall,
    addPCOCall,
    updatePCOCall,
    pcoList,
    selectedId,
    addPcoLoading,
    updatePcoLoading,
    deletePCOCall,
    setSelectedPco,
    totalNumber,
    userCountryCode,
    uploadImageCall,
    deleteImageCall,
  } = newPcoProps;

  /** Methods related to CRUD operations goes below  */

  const onDeletePco = (id: string): void => {
    setSelectedPco(id);
    deletePCOCall({ id }, () => {
      getPcoListCall({
        length: pageLength,
        page: currentPageLocal,
        isDeleted: false,
        entityType: tableFilter,
        searchText: searchKey,
      }, () => console.log('get list of pco'));
    });
  };

  const setEditModalOpen = (value: boolean, data: any) => {
    setSelectedPco(data?.id);
    setEditRecord(data);
    setAddModalVisible(value);
    setTempForm(data);
  };

  const deleteAllClicked = () => {
    // const newData: TableData[] = tableData.filter((entry: TableData) => !selectedRows.includes(entry.key)) as TableData[];
    // setTableData(newData as any);
    // setFilteredTableData(newData as any);
  };

  /*  Navigate or move view to other components */

  const setAddModalVisibility = (flag: boolean): void => {
    setAddModalVisible(flag);
  };

  /** Business Logic goes below */

  const handleFilterChange = (val: TableFilterTypes) => {
    setSearchKey('');
    setSearchKeyFinal('');
    setSelectedPco('');
    setCurrentPageLocal(1);
    setTableFilter(val);
  };

  /** All ReactElements or JSX Elements are below * */
  const pageHeader = (
    <div className={`${cssPrefix}__header-row`}>
      <Title level={3} style={{ margin: '16px 0' }}>
        People, Companies, and Organizations
      </Title>
    </div>
  );

  const filterSlot = (
    <Select
      className={`${cssPrefix}__ct__filter`}
      defaultValue={filterOptions[0].id}
      onChange={handleFilterChange}
    >
      {filterOptions?.map((opt) => (
        <Option key={opt.id} value={opt.id}>{opt.name}</Option>
      ))}
    </Select>
  );

  const contentToolbar = (
    <ContentToolbar
      filterSlot={filterSlot}
      searchKey={searchKey}
      setSearchKey={setSearchKey}
      setSearchKeyFinal={setSearchKeyFinal}
      currentPage={currentPageLocal}
      pageLength={pageLength}
      tableFilter={tableFilter}
      onAddIconClicked={setAddModalVisibility}
      disableDeleteIcon={false}
      onDeleteIconClicked={deleteAllClicked}
      onActionItemClick={() => alert('item clicked')}
    />
  );

  const nameColumnRenderer = (text: string, record: any) => (
    <Space align="baseline" size="middle">
      <span>
        {text}
      </span>
      {record.flag ? (
        <FlagFilled
          className={`${cssPrefix}__table-cell-flag${record.flag ? '--flagged' : ''}`}
        />
      ) : <span />}
    </Space>
  );

  const mailListColumnRenderer = (_text: any, record: any) => (
    <Space size="middle">
      <Switch
        className={`${cssPrefix}__table-row-switch`}
        defaultChecked={record.mailList}
        checkedChildren={<CheckOutlined />}
        unCheckedChildren={<CloseOutlined />}
        checked={record?.mailList}
        onChange={(checked: boolean) => {
          console.log(record, 'record');
          updatePCOCall({ ...record, mailList: checked, countryId: record.countryId ?? localStorage.getItem('countryId') }, () => {
            setAddModalVisibility(false);
          });
        }}
      />
    </Space>
  );

  const sortedInfo = {};
  const filteredInfo = {};

  const pcoColumns = [{
    title: tableFilter === ORG ? 'Name' : 'Last Name',
    dataIndex: 'lastName',
    onFilter: (value: any, record: any) => record.name.includes(value),
    sorter: (a: any, b: any) => a.lastName.localeCompare(b.lastName),
    render: nameColumnRenderer,
  },
  {
    title: 'First Name',
    dataIndex: 'firstName',
    onFilter: (value: any, record: any) => record.name.includes(value),
    sorter: (a: any, b: any) => a.firstName.localeCompare(b.firstName),
  },
  {
    title: 'Street',
    dataIndex: 'street',
    onFilter: (value: any, record: any) => record.name.includes(value),
    sorter: (a: any, b: any) => a.street.localeCompare(b.street),
  },
  {
    title: 'Street 2',
    dataIndex: 'street2',
    onFilter: (value: any, record: any) => record.name.includes(value),
    sorter: (a: any, b: any) => a.street2.localeCompare(b.street2),
  },
  {
    title: 'City',
    dataIndex: 'city',
    onFilter: (value: any, record: any) => record.name.includes(value),
    sorter: (a: any, b: any) => a.city.localeCompare(b.city),
    width: 100,
  },
  {
    title: 'State',
    dataIndex: 'state',
    onFilter: (value: any, record: any) => record.name.includes(value),
    sorter: (a: any, b: any) => a.state.localeCompare(b.state),
  },
  {
    title: 'Zip',
    dataIndex: 'zip',
    onFilter: (value: any, record: any) => record.name.includes(value),
    sorter: (a: any, b: any) => a.zip.localeCompare(b.zip),
  },
  {
    title: 'Phone',
    dataIndex: 'phone',
    onFilter: (value: any, record: any) => record.name.includes(value),
    sorter: (a: any, b: any) => a.phone.length - b.phone.length,
  },
  {
    title: 'Email',
    dataIndex: 'email',
    onFilter: (value: any, record: any) => record.name.includes(value),
    sorter: (a: any, b: any) => a.email.length - b.email.length,
    width: 220,
  },
  {
    title: 'Mail List',
    dataIndex: 'mailList',
    render: mailListColumnRenderer,
  }];

  /** Hooks goes below * */
  useEffect(() => {
    getPcoListCall({
      length: pageLength,
      page: clickedValue ? '1' : currentPageLocal,
      isDeleted: false,
      entityType: tableFilter,
      searchText: searchKey,
    }, () => console.log('get list of pco'));
  }, [currentPageLocal, tableFilter, searchKeyFinal]);

  useEffect(() => {
    if (!searchKey) {
      setSearchKeyFinal('');
      getPcoListCall({
        length: pageLength,
        page: clickedValue ? '1' : currentPageLocal,
        isDeleted: false,
        entityType: tableFilter,
        searchText: searchKey,
      }, () => console.log('get list of pco'));
    }
  }, [searchKey]);

  useEffect(() => {
    setSelectedPco('');
  }, []);

  return (
    <div className="container">
      {/* {pageHeader} */}
      {contentToolbar}
      {/* <SharedTable
        columns={columnsConfig}
        dataSource={filteredTableData}
        selectedRowKeys={selectedRows}
        updateSelectedRows={updateSelectedRows}
      /> */}
      <CustomTablePagination
        config={{
          rowSelection: 'radio',
          selectedRow: selectedId,
          setSelectedRow: setSelectedPco,
          isNotEditable: false,
          showHeader: true,
          selectable: true,
          tableType: 'Users',
        }}
        totalNumber={totalNumber}
        currentPage={currentPageLocal}
        setPaginationData={setCurrentPageLocal}
        tableData={pcoList}
        columnData={pcoColumns}
        isLoading={getPcoListLoading}
        delete={(id: string) => onDeletePco(id)}
        setEditModalOpen={(isOpen: boolean, data: any) => setEditModalOpen(isOpen, data)}
      />
      <PcoAddModal
        minifiedVersion={false}
        visible={addModalVisible}
        setAddModalVisibility={setAddModalVisibility}
        editRecord={editRecord}
        setEditRecord={setEditRecord}
        addPCOCall={addPCOCall}
        updatePCOCall={updatePCOCall}
        addPcoLoading={addPcoLoading}
        updatePcoLoading={updatePcoLoading}
        getPcoListCall={getPcoListCall}
        userCountryCode={userCountryCode}
        setSearchKey={setSearchKey}
        setSearchKeyFinal={setSearchKeyFinal}
        setSelectedPco={setSelectedPco}
        uploadImageCall={uploadImageCall}
        deleteImageCall={deleteImageCall}
        selectedPcoId={selectedId}
        getPcoFilter={{
          length: pageLength,
          page: currentPageLocal,
          isDeleted: false,
          entityType: tableFilter,
          searchText: '',
        }}
        handleCancel={() => {
          setAddModalVisibility(false);
          setEditRecord(null);
        }}
      />
    </div>
  );
};
