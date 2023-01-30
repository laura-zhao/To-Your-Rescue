/* eslint-disable no-unused-vars */
import {
  message, Modal, Select, Space, Typography,
} from 'antd';
import {
  FlagFilled,
} from '@ant-design/icons';
import { useEffect, useState } from 'react';
import {
  AnimalsProps, DataType, TableFilterOptions, TableFilterTypes,
} from './FtrAnimals.types';
import './FtrAnimals.less';
import { AnimalsAddModal } from './components/AnimalsAddModal';
import { ContentToolbar } from './components/ContentToolbar';
import { columns, CURRENT, FORMER } from './FtrAnimals.data';
import { animalMock } from './animals-mock';
import { pageLength } from '../../shared/constants/pagination.json';
import { apiCall } from '../../shared/api/apiWrapper';
import { pluralToSingular } from '../../utils/pluralToSingular';
import CustomTablePagination from '../../shared/components/CustomTablePagination';
import BreadCrumb from '../../shared/components/BreadCrumb';

const { Title } = Typography;
const { Option } = Select;
const { confirm } = Modal;

const cssPrefix = 'ftr-animals';

// eslint-disable-next-line
export const Animals = (props: AnimalsProps) => {
  const {
    getAnimalListLoading, getAnimalListSuccess, animalList, totalNumber, currentPage,
    addAnimalLoading, updateAnimalLoading, addAnimalSuccess, pcoList, setSelectedPcoId,
    getAnimalListCall, getAnimalListSuggestionCall, addAnimalCall, updateAnimalCall,
    deleteAnimalCall, selectedPcoId, selectedAnimalId, setSelectedAnimal, uploadImageCall, deleteImageCall,
  } = props;
  const filterOptions: TableFilterOptions[] = [
    // { id: 'all', name: 'All' },
    { id: CURRENT, name: 'Current Residents' },
    { id: FORMER, name: 'Former Residents' },
  ];

  const [onLoad, setOnLoadFlag] = useState(true);
  const [tableData, setTableData] = useState(JSON.parse(JSON.stringify(animalMock))); // eslint-disable-line
  const [filteredTableData, setFilteredTableData] = useState(tableData);
  const [tableFilter, setTableFilter] = useState(true);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [selectedRows, setSelectedRows] = useState<React.Key[]>([]);
  const [editRecord, setEditRecord] = useState(null);
  const [currentPageLocal, setCurrentPageLocal] = useState(1);
  const [searchKey, setSearchKey] = useState('');
  const [searchKeyFinal, setSearchKeyFinal] = useState('');
  const [selectedId, setSelectedId] = useState('');
  const [animalDataForDelete, setAnimalDataForDelete] = useState<any>('');

  /** Methods related to CRUD operations goes below * */

  // eslint-disable-next-line no-unused-vars
  const onDeleteAnimal = (id: string): void => {
    deleteAnimalCall({ id }, () => {
      getAnimalListCall({
        length: pageLength,
        page: currentPageLocal,
        isDeleted: false,
        isAvailable: tableFilter,
        searchText: searchKey,
      }, () => console.log('get list of pco'));
    });
  };

  const getAnimalMilestoneById = (animalId: any) => {
    setAnimalDataForDelete('');
    apiCall(`animal/get-animal-milestone/${animalId}`, 'GET', {})
      .then((resp: any) => {
        if (resp.status === 200) {
          setAnimalDataForDelete(resp?.data?.data);
        }
      });
  };

  const deleteAllClicked = () => {
    const myPromises = []; // eslint-disable-line
  };

  /** Navigate or move view to other components * */

  const setAddModalVisibility = (flag: boolean): void => {
    setAddModalVisible(flag);
  };

  const onActionItemClick = (key: React.Key, value: string) => {
    if (key === 'wide-exposure') {
      return;
    }
    if (String(value).includes('*')) {
      if (selectedRows.length === 0) {
        message.warn({
          content: 'You must select at least one animal',
          style: {
            marginTop: '2vh',
          },
          key: 'actionItemClick',
        });
      }
    } else {
      // eslint-disable-next-line no-lonely-if
      if (selectedRows.length === 0) {
        message.warn({
          content: 'You must select an animal',
          style: {
            marginTop: '2vh',
          },
          key: 'actionItemClick',
        });
      } else if (selectedRows.length > 1) {
        message.warn({
          content: 'You may only select one animal',
          style: {
            marginTop: '2vh',
          },
          key: 'actionItemClick',
        });
      }
    }
  };

  const onRefresh = () => {
    setOnLoadFlag(true);
  };

  /** Business Logic goes below * */

  const filterTableEntries = (key: string) => (str: string) => {
    const newData: DataType[] = (key && key !== '') && (str && str !== '')
      ? tableData.filter((entry: any) => entry[key].toLowerCase().includes(str.toLowerCase())) as DataType[]
      : tableData as DataType[];
    setFilteredTableData(newData as any);
  };

  const handleFilterChange = (val: TableFilterTypes) => {
    setSelectedAnimal([]);
    setTableFilter(val === 'current');
  };

  const updateSelectedRows = (records: DataType[]) => {
    const keys: React.Key[] = records.length > 0 ? records.map((r) => r.key) : [];
    setSelectedRows(keys);
  };

  useEffect(() => {
    getAnimalListCall({
      length: pageLength,
      page: currentPageLocal,
      isDeleted: false,
      isAvailable: tableFilter,
      searchText: searchKeyFinal,
    }, () => console.log('get list of animal length'));
  }, [currentPageLocal, tableFilter, searchKeyFinal]);

  useEffect(() => {
    if (!searchKey) {
      setSearchKeyFinal('');
      getAnimalListCall({
        length: pageLength,
        page: currentPageLocal,
        isDeleted: false,
        isAvailable: tableFilter,
        searchText: '',
      }, () => console.log('get list of animal length'));
    }
  }, [searchKey]);

  useEffect(() => {
    setSelectedAnimal('');
  }, []);

  /** All ReactElements or JSX Elements are below * */
  const pageHeader = (
    <div className={`${cssPrefix}__header-row`}>
      <Title level={3} style={{ margin: '16px 0' }}>
        Animals
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
      selectedAnimalId={selectedAnimalId}
      filterSlot={filterSlot}
      searchKey={searchKey}
      setSearchKey={setSearchKey}
      setSearchKeyFinal={setSearchKeyFinal}
      onAddIconClicked={setAddModalVisibility}
      disableDeleteIcon={false}
      onDeleteIconClicked={deleteAllClicked}
      onActionItemClick={onActionItemClick}
      onRefresh={() => onRefresh()}
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

  const animalTypeRender = (text: string, record: any) => (
    <span>{pluralToSingular(record?.animalType)}</span>
  );

  const columnsConfig = [
    {
      title: 'Name',
      dataIndex: 'animalName',
      sorter: (a: any, b: any) => a.animalName.localeCompare(b.animalName),
      render: nameColumnRenderer,
    },
    {
      title: 'Type',
      dataIndex: 'animalType',
      sorter: (a: any, b: any) => a?.animalType?.localeCompare(b?.animalType),
      render: animalTypeRender,
    },
    ...columns,
  ];

  /** API calls and Hooks * */

  if (onLoad) {
    filterTableEntries('resident')('current');
    setOnLoadFlag(false);
  }

  const setEditModalOpen = (value: boolean, data: any) => {
    setEditRecord(data);
    setAddModalVisible(value);
  };

  return (
    <div className={`${cssPrefix}`}>
      {/* {pageHeader} */}
      {contentToolbar}
      <CustomTablePagination
        config={{
          rowSelection: 'checkbox',
          selectedRow: selectedAnimalId,
          setSelectedRow: setSelectedAnimal,
          isNotEditable: false,
          showHeader: true,
          selectable: true,
          tableType: 'Animals',
          deleteConfirmationData: animalDataForDelete,
          getDeleteConfirmationDetail: (id: string) => getAnimalMilestoneById(id),
        }}
        totalNumber={totalNumber}
        currentPage={currentPageLocal}
        setPaginationData={setCurrentPageLocal}
        tableData={animalList}
        columnData={columnsConfig}
        isLoading={getAnimalListLoading}
        delete={(id: string) => onDeleteAnimal(id)}
        setEditModalOpen={(isOpen: boolean, data: any) => setEditModalOpen(isOpen, data)}
      />
      {/* <SharedTable
        columns={columnsConfig}
        dataSource={animalList}
        selectedRowKeys={selectedRows}
        updateSelectedRows={updateSelectedRows}
      /> */}
      <AnimalsAddModal
        pcoList={pcoList}
        visible={addModalVisible}
        editRecord={editRecord}
        setEditRecord={setEditRecord}
        selectedPcoId={selectedPcoId}
        addAnimalCall={addAnimalCall}
        getAnimalListCall={getAnimalListCall}
        addAnimalLoading={addAnimalLoading}
        updateAnimalCall={updateAnimalCall}
        updateAnimalLoading={updateAnimalLoading}
        setSelectedPcoId={setSelectedPcoId}
        setSelectedAnimal={setSelectedAnimal}
        selectedAnimalId={selectedAnimalId}
        setAddModalVisibility={setAddModalVisibility}
        setSearchKey={setSearchKey}
        setSearchKeyFinal={setSearchKeyFinal}
        uploadImageCall={uploadImageCall}
        deleteImageCall={deleteImageCall}
        getAnimalFilter={{
          length: pageLength,
          page: currentPageLocal,
          isDeleted: false,
          isAvailable: tableFilter,
          searchText: searchKey,
        }}
        handleCancel={() => {
          setAddModalVisibility(false);
          setEditRecord(null);
        }}
      />
    </div>
  );
};

export default Animals;
