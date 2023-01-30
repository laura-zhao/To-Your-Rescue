/* eslint-disable no-unused-vars */
import {
  Row, Col, Button, Dropdown, Menu, Tooltip, Modal,
} from 'antd';
import Search from 'antd/lib/input/Search';
import {
  DeleteOutlined, PlusOutlined, QuestionCircleOutlined, DownOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
// eslint-disable-next-line no-use-before-define
import React, {
  ReactElement, ReactHTMLElement, useEffect, useState,
} from 'react';
import styled from 'styled-components';
import './ContentToolbar.less';
import { kebabCase } from 'lodash';
import {
  actionsMenu1, actionsMenu2, actionsMenu3, actionsMenu4,
} from '../FtrAnimals.data';
import SearchInput from '../../../shared/components/Inputs/SearchInput.component';
import { apiCall } from '../../../shared/api/apiWrapper';

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
  searchKey: string;
  setSearchKey: (str: string) => void;
  setSearchKeyFinal: (str: string) => void;
  onAddIconClicked: (flag: boolean) => void, // eslint-disable-line
  onDeleteIconClicked: () => void,
  onActionItemClick: (key: React.Key, value: string) => void, // eslint-disable-line
  onRefresh: () => void,
  selectedAnimalId: any,
}

export const ContentToolbar = (props: ContentToolbarProps) => {
  const { selectedAnimalId } = props;
  const navigate = useNavigate();
  const { searchKey, setSearchKey, setSearchKeyFinal } = props;
  const [animalSuggestion, setAnimalSuggestion] = useState([]);

  const addBtnClicked = () => { props.onAddIconClicked(true); };

  const deleteBtnClicked = () => { props.onDeleteIconClicked(); };

  const showActions = () => { };

  const handleActionsMenuClick = ({ key, value }: { key: React.Key, value: string }) => {
    props.onActionItemClick(key, value);
  };

  const deleteIconTooltip: string = props.disableDeleteIcon ? 'Please select entries from Table to delete'
    : 'Delete selected entries';

  const confirmDelete = ( // eslint-disable-line
    <Tooltip title={deleteIconTooltip}>
      <Button
        className={`${cssPrefix}__button`}
        type="dashed"
        disabled={props.disableDeleteIcon}
        // eslint-disable-next-line
        onClick={showPropsConfirm}
        icon={<DeleteOutlined />}
      >
        Delete
      </Button>
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
      {actionsMenu1(navigate, selectedAnimalId).map(({ key, value, actionFunction }) => (
        <Menu.Item onClick={() => actionFunction && actionFunction()} key={kebabCase(key)}>{value}</Menu.Item>
      ))}
      <Menu.Divider />
      {actionsMenu2.map(({ key, value }) => (
        <Menu.Item onClick={() => handleActionsMenuClick({ key, value })} key={kebabCase(key)}>{value}</Menu.Item>
      ))}
      <Menu.Divider />
      {actionsMenu3.map(({ key, value }) => (
        <Menu.Item onClick={() => handleActionsMenuClick({ key, value })} key={kebabCase(key)}>{value}</Menu.Item>
      ))}
      <Menu.Divider />
      {actionsMenu4.map(({ key, value }) => (
        <Menu.Item onClick={() => handleActionsMenuClick({ key, value })} key={kebabCase(key)}>{value}</Menu.Item>
      ))}
    </Menu>
  );

  useEffect(() => {
    const data = {};
    apiCall(`animal/auto-complete-animal-list?searchText=${searchKey}&limit=20`, 'GET', data)
      .then((resp: any) => {
        if (resp.status === 200) {
          setAnimalSuggestion(resp?.data?.data);
        }
      });
  }, [searchKey]);

  return (
    <Wrapper className={`${cssPrefix}`}>
      <Row className={`${cssPrefix}__row`}>
        <Col className="">
          <SearchInput
            placeholder="Search Name"
            searchKey={searchKey}
            setSearchKey={setSearchKey}
            setSearchKeyFinal={setSearchKeyFinal}
            options={animalSuggestion}
            value="any"
          />
          {/* <Search
            placeholder="Search Name"
            className={`${cssPrefix}__search`}
            autoFocus
            onSearch={onSearchvalue}
            enterButton
          /> */}
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
