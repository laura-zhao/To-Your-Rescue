import {
  useEffect, useRef, useState, FC,
} from 'react';
import UsersList from './components/UsersList';
import { UsersProps } from './Users.types';
import './Users.less';

const cssPrefix = 'ftr-users';

export const Users: FC<UsersProps> = (newUsersProps) => {
  const titleRef = useRef<HTMLInputElement>(null);
  const {
    getUserListCall, getUserListLoading, inviteUserCall, userList, updateUser, deleteUser, inviteUserLoading,
  } = newUsersProps;
  const [viewInactive, setViewInactive] = useState(false);

  useEffect(() => {
    // titleRef.current?.scrollIntoView();
  }, [titleRef]);

  useEffect(() => {
    getUserListCall(viewInactive, () => console.log('--------'));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [viewInactive]);

  // eslint-disable-next-line no-unused-vars
  const pageHeader = (
    <>
      <div className={`${cssPrefix}__header-row`}>
        {/* <Title level={3} style={{ margin: '16px 0' }}>
          Users
        </Title> */}
      </div>
    </>
  );

  return (
    <div className={`${cssPrefix}`} ref={titleRef}>
      {/* {pageHeader} */}
      <UsersList
        inviteUserLoading={inviteUserLoading}
        loading={getUserListLoading}
        userList={userList}
        getUserListCall={getUserListCall}
        updateUser={updateUser}
        deleteUser={deleteUser}
        inviteUserCall={inviteUserCall}
        viewInactive={viewInactive}
        setViewInactive={setViewInactive}
      />
    </div>
  );
};
