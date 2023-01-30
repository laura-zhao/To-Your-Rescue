import { authTypes } from './types';

const initialState = {
  signupLoading: false,
  loginLoading: false,
  login: false,
  userType: '',
  updatePasswordIniteLoading: false,
  updatePasswordIniteSuccess: false,
  verifySignupByTokenLoading: false,
  verifySignupByTokenSuccess: false,
  forgotUsernameLoading: false,
  forgotUsernameSuccess: false,
  forgotPasswordLoading: false,
  forgotPasswordSuccess: false,
  tempUserDetail: {},
};

interface ActionType {
  type: string,
  payload: any,
}

export const authReducer = (state = initialState, action: ActionType) => {
  switch (action.type) {
    case authTypes.SIGNUP_LOADING:
      return {
        ...state,
        signupLoading: action.payload,
        login: false,
      };
    case authTypes.LOGIN_LOADING:
      return {
        ...state,
        loginLoading: action.payload,
        login: false,
      };
    case authTypes.LOGIN_SUCCESS:
      return {
        ...state,
        login: true,
        userType: action.payload.roleName,
        countryCode: action.payload.countryCode,
      };
    case authTypes.SET_INTERVAL_ID:
      return {
        ...state,
        intervalId: action.payload,
      };
    case authTypes.GET_USER_DETAIL_BY_TOKEN_LOADING:
      return {
        ...state,
        getUserDetailByTokenLoading: true,
      };
    case authTypes.GET_USER_DETAIL_BY_TOKEN_SUCCESS:
      return {
        ...state,
        getUserDetailByTokenLoading: false,
        tempUserDetail: action.payload,
      };
    case authTypes.VERIFY_SIGNUP_BY_TOKEN_LOADING:
      return {
        ...state,
        verifySignupByTokenLoading: true,
        verifySignupByTokenSuccess: false,
      };
    case authTypes.VERIFY_SIGNUP_BY_TOKEN_SUCCESS:
      return {
        ...state,
        verifySignupByTokenLoading: false,
        verifySignupByTokenSuccess: true,
      };
    case authTypes.FORGOT_USERNAME_LOADING:
      return {
        ...state,
        forgotUsernameLoading: true,
        forgotUsernameSuccess: false,
      };
    case authTypes.FORGOT_USERNAME_SUCCESS:
      return {
        ...state,
        forgotUsernameLoading: false,
        forgotUsernameSuccess: true,
      };
    case authTypes.FORGOT_PASSWORD_LOADING:
      return {
        ...state,
        forgotPasswordLoading: true,
        forgotPasswordSuccess: false,
      };
    case authTypes.FORGOT_PASSWORD_SUCCESS:
      return {
        ...state,
        forgotPasswordLoading: false,
        forgotPasswordSuccess: true,
      };
    case authTypes.RESET_PASSWORD_LOADING:
      return {
        ...state,
        forgotPasswordLoading: true,
        forgotPasswordSuccess: false,
      };
    case authTypes.RESET_PASSWORD_SUCCESS:
      return {
        ...state,
        forgotPasswordLoading: false,
        forgotPasswordSuccess: true,
      };
    default:
      return {
        ...state,
      };
  }
};
