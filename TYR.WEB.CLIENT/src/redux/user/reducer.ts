import { userActionTypes } from './types';

const initialState = {
  getUserListLoading: false,
  getUserListSuccess: false,
  inviteUserLoading: false,
  userList: [],
  updateUserListLoading: false,
  updateUserListSuccess: false,
  deleteUserLoading: false,
  deleteUserSuccess: false,
};

interface ActionType {
  type: string,
  payload: any,
}

export const authReducer = (state = initialState, action: ActionType) => {
  switch (action.type) {
    case userActionTypes.GET_USER_LIST_LOADING:
      return {
        ...state,
        getUserListLoading: true,
        getUserListSuccess: false,
      };
    case userActionTypes.GET_USER_LIST_SUCCESS:
      return {
        ...state,
        getUserListLoading: false,
        getUserListSuccess: true,
        userList: action.payload,
      };
    case userActionTypes.INVITE_USER_LOADING:
      return {
        ...state,
        inviteUserLoading: true,
      };
    case userActionTypes.INVITE_USER_SUCCESS:
      return {
        ...state,
        inviteUserLoading: false,
      };
    case userActionTypes.UPDATE_USER_LOADING:
      return {
        ...state,
        updateUserListLoading: true,
        updateUserListSuccess: false,
      };
    case userActionTypes.UPDATE_USER_SUCCESS:
      return {
        ...state,
        updateUserListLoading: false,
        updateUserListSuccess: true,
      };
    case userActionTypes.DELETE_USER_LOADING:
      return {
        ...state,
        deleteUserLoading: true,
        deleteUserSuccess: false,
      };
    case userActionTypes.DELETE_USER_SUCCESS:
      return {
        ...state,
        deleteUserLoading: false,
        deleteUserSuccess: true,
      };
    default:
      return {
        ...state,
      };
  }
};
