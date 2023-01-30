/* eslint-disable no-unused-vars */
import { message } from 'antd';
import { useNavigate } from 'react-router-dom';
import Cookies from 'universal-cookie';
import { apiCall } from '../../shared/api/apiWrapper';
import { userActionTypes } from './types';

const getUserListLoading = (data: any) => ({
  type: userActionTypes.GET_USER_LIST_LOADING,
  payload: data,
});

const getUserListSuccess = (data: any) => ({
  type: userActionTypes.GET_USER_LIST_SUCCESS,
  payload: data,
});

const inviteUserLoading = (data: any) => ({
  type: userActionTypes.INVITE_USER_LOADING,
  payload: data,
});

const inviteUserSuccess = (data: any) => ({
  type: userActionTypes.INVITE_USER_SUCCESS,
  payload: data,
});

export const inviteUserCall = (data: any, callbackFunction: () => void) => {
  console.log(data);

  return (dispatch: any, getSate: any) => {
    dispatch(inviteUserLoading(true));
    apiCall('User/inviteuser', 'POST', data)
      .then((resp: any) => {
        dispatch(inviteUserLoading(false));
        dispatch(inviteUserSuccess(false));
        if (resp.status !== 200) {
          resp?.data?.message && message.error({
            content: resp?.data?.message,
            style: {
              marginTop: '2vh',
            },
            key: 'updatable',
          });
          return;
        }
        callbackFunction();
        resp?.data?.message && message.success({
          content: resp?.data?.message,
          style: {
            marginTop: '2vh',
          },
          key: 'updatable',
        });
      });
  };
};

export const getUserListCall = (data: any, callbackFunction: () => void) => {
  console.log(data);

  return (dispatch: any, getSate: any) => {
    dispatch(getUserListLoading(true));
    apiCall(`user/get-users/${data ? 'false' : 'true'}`, 'GET', data)
      .then((resp: any) => {
        dispatch(getUserListLoading(false));
        if (resp.status !== 200) {
          getUserListSuccess(false);
          resp?.data?.message && message.error({
            content: resp?.data?.message,
            style: {
              marginTop: '2vh',
            },
            key: 'updatable',
          });
          return;
        }
        // resp?.data?.message && message.success({
        //   content: resp?.data?.message,
        //   style: {
        //     marginTop: '2vh',
        //   },
        //   key: 'updatable',
        // });
        dispatch(getUserListSuccess(resp?.data?.data?.usersVMs));
        callbackFunction();
      });
  };
};

const updateUserLoading = (data: any) => ({
  type: userActionTypes.INVITE_USER_LOADING,
  payload: data,
});

const updateUserSuccess = (data: any) => ({
  type: userActionTypes.INVITE_USER_SUCCESS,
  payload: data,
});

export const updateUser = (data: any, callbackFunction: () => void) => {
  console.log(data);

  return (dispatch: any, getSate: any) => {
    dispatch(updateUserLoading(true));
    apiCall(`user/update-user/${data?.id}`, 'PUT', data)
      .then((resp: any) => {
        dispatch(updateUserSuccess(false));
        if (resp.status !== 200) {
          resp?.data?.message && message.error({
            content: resp?.data?.message,
            style: {
              marginTop: '2vh',
            },
            key: 'updatable',
          });
          return;
        }
        callbackFunction();
        resp?.data?.message && message.success({
          content: resp?.data?.message,
          style: {
            marginTop: '2vh',
          },
          key: 'updatable',
        });
      });
  };
};

const deleteUserLoading = (data: any) => ({
  type: userActionTypes.DELETE_USER_LOADING,
  payload: data,
});

const deleteUserSuccess = (data: any) => ({
  type: userActionTypes.DELETE_USER_SUCCESS,
  payload: data,
});

export const deleteUser = (data: any, callbackFunction: () => void) => {
  console.log(data);

  return (dispatch: any, getSate: any) => {
    dispatch(deleteUserLoading(true));
    apiCall(`user/delete-user/${data?.userId}`, 'PATCH', {})
      .then((resp: any) => {
        dispatch(deleteUserSuccess(false));
        if (!resp?.data?.success) {
          const messageText = resp?.data?.message || resp?.data?.errors?.[0];
          messageText && message.error({
            content: messageText,
            style: {
              marginTop: '2vh',
            },
            key: 'updatable',
          });
          return;
        }
        callbackFunction();
        resp?.data?.message && message.success({
          content: resp?.data?.message,
          style: {
            marginTop: '2vh',
          },
          key: 'updatable',
        });
      });
  };
};

// export const isEmailAvialbleCall = (data: any, callbackFunction: () => void) => {
//   console.log(data);

//   return (dispatch: any, getSate: any) => {
//     dispatch(deleteUserLoading(true));
//     apiCall(`user/available-email-address?email=${data?.email}`, 'PATCH', {})
//       .then((resp: any) => {
//         dispatch(deleteUserSuccess(false));
//         // callbackFunction(resp?.success);
//       });
//   };
// };
