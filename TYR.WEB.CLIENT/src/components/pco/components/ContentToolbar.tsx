/* eslint-disable no-unused-vars */
/* eslint-disable no-use-before-define */
import {
  Row,
  Col,
  Button,
  Dropdown,
  AutoComplete,
  Menu,
  Tooltip,
  Modal,
} from 'antd';
import Search from 'antd/lib/input/Search';
import {
  DeleteOutlined,
  PlusOutlined,
  QuestionCircleOutlined,
  DownOutlined,
} from '@ant-design/icons';
import React, {
  ReactElement, ReactHTMLElement, useEffect, useState,
} from 'react';
import styled from 'styled-components';
import './ContentToolbar.less';
import { kebabCase, values } from 'lodash';
import { mockMenu1 } from '../Pco.data';
import { apiCall } from '../../../shared/api/apiWrapper';
import SearchInput from '../../../shared/components/Inputs/SearchInput.component';

const cssPrefix = 'content-toolbar';

const { confirm } = Modal;

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  padding: 10px 0px;
`;

export interface ContentToolbarProps {
  filterSlot?: ReactElement | ReactHTMLElement<HTMLElement>,
  disableDeleteIcon: boolean;
  tableFilter: any;
  currentPage: any,
  pageLength: any,
  searchKey: string;
  setSearchKey: (str: string) => void;
  setSearchKeyFinal: (str: string) => void;
  onAddIconClicked: (flag: boolean) => void,
  onDeleteIconClicked: () => void,
  onActionItemClick: (item: React.Key, value: string) => void,
}

export const ContentToolbar = (props: ContentToolbarProps) => {
  const { searchKey, setSearchKey, setSearchKeyFinal } = props;
  const [pcoSuggestion, setPcoSuggestion] = useState([]);
  const addBtnClicked = () => { props.onAddIconClicked(true); };
  const deleteBtnClicked = () => { props.onDeleteIconClicked(); };
  const showActions = () => { };

  useEffect(() => {
    const data = {};
    apiCall(`PCO/search-autocomplete?searchText=${searchKey}&limit=${props?.pageLength}&entityType=${(props?.tableFilter === 'all') ? '' : props?.tableFilter}`, 'GET', data)
      .then((resp: any) => {
        if (resp?.data?.success) {
          setPcoSuggestion(resp?.data?.data);
        }
      });
  }, [searchKey]);

  const handleActionsMenuClick = ({ key, value }: { key: React.Key, value: string }) => {
    props.onActionItemClick(key, value);
  };

  const deleteIconTooltip: string = props.disableDeleteIcon ? 'Please select entries from Table to delete'
    : 'Delete selected entries';

  // eslint-disable-next-line
  const confirmDelete = (
    <Tooltip title={deleteIconTooltip}>
      <Button
        className={`${cssPrefix}__button`}
        type="dashed"
        disabled={props.disableDeleteIcon}
        onClick={showPropsConfirm}
        icon={<DeleteOutlined />}
      />
    </Tooltip>
  );

  function showPropsConfirm() {
    confirm({
      title: 'Delete',
      icon: <QuestionCircleOutlined style={{ color: 'red' }} />,
      content: 'Are you sure you want to delete？',
      okText: 'Delete',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk() {
        deleteBtnClicked();
      },
    });
  }

  const actionsMenu = (
    <Menu>
      {mockMenu1.map(({ key, value }) => (
        <Menu.Item onClick={() => handleActionsMenuClick({ key, value })} key={kebabCase(key)}>{value}</Menu.Item>
      ))}
    </Menu>
  );

  return (
    <Wrapper className={`${cssPrefix}`}>
      <Row className={`${cssPrefix}__row`}>
        <Col className="">
          {/* <AutoComplete
            key="value"
            options={options}
            style={{ width: 200 }}
            onSelect={onSelect}
            onSearch={onSearch}
            placeholder="Search Last Name"
          /> */}
          <SearchInput
            placeholder="Search Last Name"
            searchKey={searchKey}
            setSearchKey={setSearchKey}
            setSearchKeyFinal={setSearchKeyFinal}
            options={pcoSuggestion}
          />
        </Col>
        <Col className={`${cssPrefix}__col--pull-right ${cssPrefix}__filters`}>
          {props.filterSlot}
        </Col>
        <Col>
          <Button
            className={`${cssPrefix}__button`}
            type="dashed"
            onClick={addBtnClicked}
            icon={<PlusOutlined />}
          >
            Add
          </Button>
        </Col>
        {/* <Col>
          {confirmDelete}
        </Col> */}
        <Col>
          <Dropdown overlay={actionsMenu}>
            <Button
              className={`${cssPrefix}__button ${cssPrefix}__button--primary`}
              type="primary"
              onClick={showActions}
            >
              Actions
              {' '}
              <DownOutlined />
            </Button>
          </Dropdown>
        </Col>
      </Row>
    </Wrapper>
  );
};
