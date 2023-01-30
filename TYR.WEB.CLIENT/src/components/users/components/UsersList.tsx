import { useState, FC, useEffect } from 'react';
import {
  Row, Col, Button, message,
} from 'antd';
import moment from 'moment';
import Cookies from 'universal-cookie';
import { PlusOutlined } from '@ant-design/icons';
import CustomTable from '../../../shared/components/CustomTable';
import AddUserForm from '../components/AddUserForm';
import { apiCall } from '../../../shared/api/apiWrapper';
import alertConstant from '../../../shared/constants/alert.json';

interface UserListProps {
  loading: boolean,
  inviteUserLoading: boolean,
  userList: any,
  inviteUserCall: any,
  updateUser: any,
  getUserListCall: any,
  deleteUser: any,
  viewInactive: any,
  setViewInactive: any
}

const cookies = new Cookies();
const cssPrefix = 'ftr-users';

const UserList: FC<UserListProps> = (newUserListProps) => {
  const {
    loading, userList, updateUser, inviteUserCall, getUserListCall, deleteUser, viewInactive, setViewInactive, inviteUserLoading,
  } = newUserListProps;
  const [editModal, setEditModal] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  // eslint-disable-next-line
  const [editData, setEditData] = useState(Object);
  const [userForm, setUserForm] = useState<any>({});
  const [tempForm, setTempForm] = useState('');
  const [userType, setUserType] = useState('');
  const [sendLoading, setSendLoading] = useState(false);

  useEffect(() => {
    setUserType(cookies.get('loginDetails')?.userType);
  }, []);

  const showModal = () => {
    setTempForm('');
    setIsModalVisible(true);
  };

  const handleUserDelete = (userId: string) => {
    deleteUser({ userId }, () => {
      message.success({
        content: alertConstant.user_delete_success,
        style: {
          marginTop: '2vh',
        },
        key: 'updatable',
      });
      getUserListCall(viewInactive, () => console.log('Getting user list'));
    });
  };

  // eslint-disable-next-line
  const setEditModalOpen = (value: boolean, data: any) => {
    setEditModal(true);
    setTempForm(data);
    setEditData(data);
    setUserForm({ ...data });
    setIsModalVisible(value);
  };

  const sendInvitation = (record: any) => {
    setSendLoading(record?.id);
    apiCall(`user/resend-invitation?email=${record?.email}`, 'POST', {})
      .then((resp: any) => {
        setSendLoading(false);
        if (resp.status === 200) {
          const messageText = resp?.data?.errors?.[0] || resp?.data?.message;
          message.success({
            content: (messageText),
            style: {
              marginTop: '2vh',
            },
            key: 'updatable',
          });
        }
      });
  };

  return (
    <>
      <div style={{ marginTop: '0px' }}>
        <AddUserForm
          inviteUserLoading={inviteUserLoading}
          viewInactive={viewInactive}
          userForm={userForm}
          setUserForm={setUserForm}
          editModal={editModal}
          setEditModal={setEditModal}
          tempForm={tempForm}
          isModalVisible={isModalVisible}
          setIsModalVisible={(data) => setIsModalVisible(data)}
          getUserListCall={getUserListCall}
          onSubmit={editModal ? updateUser : inviteUserCall}
        />
        <Row style={{ marginBottom: '10px', alignItems: 'center' }}>
          <Col flex={3}>
            <Row justify="start" style={{ width: '200px' }}>
              {/* <Input
                 onChange={(e)=>onSearch(e.target.value)}
                 placeholder="Search Animal Type"/> */}
            </Row>
          </Col>
          <Col flex={3}>
            <Row justify="end">
              {/* <Typography.Link><PlusOutlined style={{ fontSize: '150%'}} onClick={showModal}/></Typography.Link> */}
              <Button
                className={`${cssPrefix}__button`}
                type="dashed"
                onClick={() => setViewInactive(!viewInactive)}
              >
                View
                {(viewInactive ? ' Active ' : ' Inactive ')}
                Users
              </Button>
              <Button
                className={`${cssPrefix}__button`}
                type="dashed"
                onClick={showModal}
                icon={<PlusOutlined />}
              >
                Invite New
              </Button>
            </Row>
          </Col>
        </Row>
        <CustomTable
          config={{
            rowSelection: 'none',
            sendLoading,
            sendInvitation,
          }}
          isNotEditable={viewInactive || userType?.toLocaleLowerCase() !== 'administrator'}
          showHeader
          selectable={false}
          tableData={userList}
          tableType="Users"
          isLoading={loading}
          columnData={[{
            title: 'Name',
            width: '20%',
            render: (_: any, record: any) => `${record.firstName} ${record.lastName}`,
          },
          {
            title: 'Username',
            width: '12%',
            render: (_: any, record: any) => (record?.status ? `${record.userName}` : 'Invited'),
          },
          {
            title: 'Email',
            width: '15%',
            render: (_: any, record: any) => (record.email),
          },
          {
            title: 'Role',
            width: '15%',
            render: (_: any, record: any) => (
              record.role
            ),
          },
          {
            title: 'Date Active',
            width: '10%',
            render: (_: any, record: any) => (record.dateActive ? moment(record.dateActive).format('MMM DD YYYY') : ''),
          },
          {
            title: 'Date Inactive',
            width: '10%',
            render: (_: any, record: any) => (record.dateInactive ? moment(record.dateInactive).format('MMM DD YYYY') : ''),
          },
          ]}
          delete={handleUserDelete}
          setEditModalOpen={setEditModalOpen}
        />
      </div>
    </>
  );
};

export default UserList;
