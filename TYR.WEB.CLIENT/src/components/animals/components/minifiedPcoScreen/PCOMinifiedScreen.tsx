/* eslint-disable no-shadow */
/* eslint-disable no-use-before-define */
/* eslint-disable no-unused-vars */
import { useEffect, useState, FC } from 'react';
import { connect } from 'react-redux';
import Cookies from 'universal-cookie';
import {
  Row, Button, Space,
} from 'antd';
import {
  PlusOutlined, FlagFilled,
} from '@ant-design/icons';
import { apiCall } from '../../../../shared/api/apiWrapper';
import { PcoAddModal } from '../../../pco/components/PcoAddModal';
import CustomTablePagination from '../../../../shared/components/CustomTablePagination';
import SearchInput from '../../../../shared/components/Inputs/SearchInput.component';
import { pageLengthMinifiedPco } from '../../../../shared/constants/pagination.json';

export interface PCOAddModalProps {
  visible?: boolean;
  addPcoLoading?: boolean;
  updatePcoLoading?: boolean;
  setAddModalVisibility?: any;
  addPCOCall?: any;
  updatePCOCall?: any;
  getPcoListCall?: any;
  userCountryCode?: string;
  getPcoFilter?: any;
  pcoList: [],
  totalNumber: number,
  getPcoListLoading: boolean,
  setSelectedPco: any,
  selectedId: string,
  setFirstError: any,
}

const cookies = new Cookies();
const cssPrefix = 'ftr-pco';

export const PCOMinifiedScreen: FC<PCOAddModalProps> = (props) => {
  const {
    addPCOCall,
    updatePCOCall,
    getPcoListCall,
    userCountryCode,
    pcoList,
    totalNumber,
    getPcoListLoading,
    setSelectedPco,
    selectedId,
    getPcoFilter,
    setFirstError,
  } = props;
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [editRecord, setEditRecord] = useState<any>({});
  const [currentPageLocal, setCurrentPageLocal] = useState(1);
  const [searchKey, setSearchKey] = useState('');
  const [searchKeyFinal, setSearchKeyFinal] = useState('');
  const [tempForm, setTempForm] = useState({});
  const [pcoSuggestion, setPcoSuggestion] = useState([]);
  const [tableFilter, setTableFilter] = useState({
    pageLength: pageLengthMinifiedPco,
    page: 1,
    isDeleted: false,
    entityType: 'person',
    searchText: '',
  });

  const setEditModalOpen = (value: boolean, data: any) => {
    setEditRecord(data);
    setAddModalVisible(value);
    setTempForm(data);
  };

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

  useEffect(() => {
    setFirstError('');
    // if (!searchKey) {
    //   setSearchKeyFinal('');
    // }
    getPcoListCall({
      length: pageLengthMinifiedPco,
      page: currentPageLocal,
      isDeleted: false,
      entityType: tableFilter?.entityType,
      searchText: searchKeyFinal,
    }, () => console.log('get list of pco'));
  }, [currentPageLocal, tableFilter, searchKeyFinal]);

  useEffect(() => {
    if (!searchKey) {
      setSearchKeyFinal('');
      getPcoListCall({
        length: pageLengthMinifiedPco,
        page: currentPageLocal,
        isDeleted: false,
        entityType: tableFilter?.entityType,
        searchText: searchKeyFinal,
      }, () => console.log('get list of pco'));
    }
  }, [searchKey]);

  useEffect(() => {
    const data = {};
    apiCall(`PCO/search-autocomplete?searchText=${searchKey}&limit=20`, 'GET', data)
      .then((resp: any) => {
        if (resp.status === 200) {
          setPcoSuggestion(resp?.data?.data);
        }
      });
  }, [searchKey]);

  const pcoColumns = [{
    title: 'Last Name',
    dataIndex: 'lastName',
    render: nameColumnRenderer,
  },
  {
    title: 'First Name',
    dataIndex: 'firstName',
  },
  {
    title: 'Street',
    dataIndex: 'street',
  },
  // {
  //   title: 'Street 2',
  //   dataIndex: 'street2',
  // },
  {
    title: 'City',
    dataIndex: 'city',
    width: 100,
  },
  {
    title: 'State',
    dataIndex: 'state',
  },
    // {
    //   title: 'Zip',
    //   dataIndex: 'zip',
    // },
    // {
    //   title: 'Phone',
    //   dataIndex: 'phone',
    // },
    // {
    //   title: 'Email',
    //   dataIndex: 'email',
    //   width: 220,
    // },
  ];

  return (
    <div>
      <PcoAddModal
        minifiedVersion
        visible={addModalVisible}
        setAddModalVisibility={setAddModalVisible}
        editRecord={editRecord}
        setEditRecord={setEditRecord}
        addPCOCall={addPCOCall}
        updatePCOCall={updatePCOCall}
        addPcoLoading={false}
        updatePcoLoading={false}
        getPcoListCall={getPcoListCall}
        userCountryCode="userCountryCode"
        setSearchKey={setSearchKey}
        setSearchKeyFinal={setSearchKeyFinal}
        setSelectedPco={setSelectedPco}
        getPcoFilter={{
          length: pageLengthMinifiedPco,
          page: currentPageLocal,
          isDeleted: false,
          entityType: tableFilter?.entityType,
          searchText: searchKey,
        }}
        handleCancel={() => {
          setAddModalVisible(false);
          setEditRecord(null);
        }}
      />
      <Row justify="space-between" style={{ marginBottom: '4px' }}>
        <SearchInput
          searchKey={searchKey}
          setSearchKey={setSearchKey}
          setSearchKeyFinal={setSearchKeyFinal}
          options={pcoSuggestion}
          placeholder="Search Last Name"
        />
        <Button
          className={`${cssPrefix}__button`}
          type="dashed"
          onClick={() => setAddModalVisible(true)}
          icon={<PlusOutlined />}
        >
          Add
        </Button>
      </Row>
      <CustomTablePagination
        config={{
          rowSelection: 'radio',
          selectedRow: selectedId,
          setSelectedRow: setSelectedPco,
          isNotDeletable: true,
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
        delete={(id: string) => alert(id)}
        setEditModalOpen={(isOpen: boolean, data: any) => setEditModalOpen(isOpen, data)}
      />
    </div>
  );
};
