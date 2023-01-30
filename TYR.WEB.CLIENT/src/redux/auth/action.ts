/* eslint-disable no-unused-vars */
import { message } from 'antd';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';
import Cookies from 'universal-cookie';
import { apiCall } from '../../shared/api/apiWrapper';
import { authTypes } from './types';
import { refreshTokenTime, loginMaxAge } from '../../shared/constants/auth.json';

const signupLoading = (data: any) => ({
  type: authTypes.SIGNUP_LOADING,
  payload: data,
});

const loginLoading = (data: any) => ({
  type: authTypes.LOGIN_LOADING,
  payload: data,
});

const loginSuccess = (data: any) => ({
  type: authTypes.LOGIN_SUCCESS,
  payload: data,
});

const logout = () => ({
  type: authTypes.USER_LOGOUT,
});

const getUserDetailByTokenLoading = (data: any) => ({
  type: authTypes.GET_USER_DETAIL_BY_TOKEN_LOADING,
  payload: data,
});

const getUserDetailByTokenSuccess = (data: any) => ({
  type: authTypes.GET_USER_DETAIL_BY_TOKEN_SUCCESS,
  payload: data,
});

const verifySignupByTokenLoading = (data: any) => ({
  type: authTypes.VERIFY_SIGNUP_BY_TOKEN_LOADING,
  payload: data,
});

const verifySignupByTokenSuccess = (data: any) => ({
  type: authTypes.VERIFY_SIGNUP_BY_TOKEN_SUCCESS,
  payload: data,
});

const updatePasswordInviteLoading = (data: any) => ({
  type: authTypes.UPDATE_PASSWORD_INVITE_LOADING,
  payload: data,
});

const updatePasswordInviteSuccess = (data: any) => ({
  type: authTypes.UPDATE_PASSWORD_INVITE_SUCCESS,
  payload: data,
});

const forgotUsernameLoading = () => ({
  type: authTypes.FORGOT_USERNAME_LOADING,
});

const forgotUsernameSuccess = () => ({
  type: authTypes.FORGOT_USERNAME_SUCCESS,
});

const forgotPasswordLoading = () => ({
  type: authTypes.FORGOT_PASSWORD_LOADING,
});

const forgotPasswordSuccess = () => ({
  type: authTypes.FORGOT_PASSWORD_SUCCESS,
});

const resetPasswordLoading = () => ({
  type: authTypes.RESET_PASSWORD_LOADING,
});

const resetPasswordSuccess = () => ({
  type: authTypes.RESET_PASSWORD_SUCCESS,
});

// eslint-disable-next-line no-unused-vars
export const signUpCall = (data: any, callbackFunction: () => void) => {
  console.log(data);

  // eslint-disable-next-line no-unused-vars
  return (dispatch: any, getSate: any) => {
    dispatch(signupLoading(true));
    apiCall('authenticate/signup-admin', 'POST', data)
      .then((resp: any) => {
        dispatch(signupLoading(false));
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

// eslint-disable-next-line no-unused-vars
export const loginCall = (data: any, callbackFunction: () => void) => {
  console.log(data);
  const cookies = new Cookies();
  // eslint-disable-next-line no-unused-vars
  return (dispatch: any, getSate: any) => {
    dispatch(loginLoading(true));
    apiCall('authenticate/signin', 'POST', data)
      .then((resp: any) => {
        dispatch(loginLoading(false));
        if (resp.status !== 200) {
          loginSuccess(false);
          resp?.data?.message && message.error({
            content: resp?.data?.message,
            style: {
              marginTop: '2vh',
            },
            key: 'updatable',
          });
          return;
        }
        resp?.data?.message && message.success({
          content: resp?.data?.message,
          style: {
            marginTop: '2vh',
          },
          key: 'updatable',
        });
        dispatch(loginSuccess(resp?.data?.data));
        if (data?.staySignedIn) {
          cookies.set('login', true, { path: '/', maxAge: loginMaxAge });
          cookies.set('loginDetails', {
            token: resp?.data?.token,
            refreshToken: resp?.data?.refreshToken,
            expireAt: moment(Date.now()).add(refreshTokenTime, 'minute').format('YYYY-MM-DDTHH:mm:ssZz'),
            user: data?.userName,
            loginDetails: resp?.data,
            userType: resp?.data?.data?.roleName,
            tenantId: resp?.data?.data?.tenantId,
            userCountryCode: resp?.data?.data?.countryCode,
          }, { path: '/', maxAge: loginMaxAge });
        } else {
          cookies.set('login', true, { path: '/' });
          cookies.set('loginDetails', {
            token: resp?.data?.token,
            refreshToken: resp?.data?.refreshToken,
            expireAt: moment(Date.now()).add(refreshTokenTime, 'minute').format('YYYY-MM-DDTHH:mm:ssZz'),
            user: data?.userName,
            loginDetails: resp?.data,
            sessionLogin: true,
            userType: resp?.data?.data?.roleName,
            tenantId: resp?.data?.data?.tenantId,
            userCountryCode: resp?.data?.data?.countryCode,
          }, { path: '/' });
        }
        callbackFunction();
      });
  };
};

// eslint-disable-next-line no-unused-vars
export const logoutCall = (data: any) => {
  console.log(data);

  // eslint-disable-next-line no-unused-vars
  return (dispatch: any, getSate: any) => {
    const navigate = useNavigate();
    navigate('/');
    dispatch(logout());
  };
};

// eslint-disable-next-line no-unused-vars
export const getUserDetailByToken = (data: any, callbackFunction: (detailMessage: string) => void) => {
  console.log(data);

  const { token, email } = data;
  // eslint-disable-next-line no-unused-vars
  return (dispatch: any, getSate: any) => {
    dispatch(getUserDetailByTokenLoading(true));
    apiCall(`user/verify-email?token=${token}&email=${email}`, 'GET', {})
      .then((resp: any) => {
        dispatch(getUserDetailByTokenSuccess(resp?.data?.data?.usersVM));
        if (resp.status !== 200) {
          callbackFunction(resp?.data?.errors?.[0]);
          resp?.data?.message && message.error({
            content: resp?.data?.message,
            style: {
              marginTop: '2vh',
            },
            key: 'updatable',
          });
          return;
        }
        callbackFunction(resp?.data?.errors?.[0]);
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

// eslint-disable-next-line no-unused-vars
export const verifySignupByToken = (data: any, callbackFunction: (detailMessage: string) => void) => {
  console.log(data);

  const { token, email } = data;
  // eslint-disable-next-line no-unused-vars
  return (dispatch: any, getSate: any) => {
    dispatch(verifySignupByTokenLoading(true));
    apiCall(`user/signup-verify-email?token=${token}&email=${email}`, 'GET', {})
      .then((resp: any) => {
        dispatch(verifySignupByTokenSuccess(resp?.data?.data?.usersVM));
        if (resp.status !== 200) {
          callbackFunction(resp?.data?.errors?.[0]);
          resp?.data?.message && message.error({
            content: resp?.data?.message,
            style: {
              marginTop: '2vh',
            },
            key: 'updatable',
          });
          return;
        }
        callbackFunction(resp?.data?.errors?.[0]);
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

// eslint-disable-next-line no-unused-vars
export const updatePasswordInvite = (data: any, callbackFunction: () => void) => {
  console.log(data);

  // eslint-disable-next-line no-unused-vars
  return (dispatch: any, getSate: any) => {
    dispatch(updatePasswordInviteLoading(true));

    const { token } = data;
    apiCall(`user/update-user-on-emailconfirmation?token=${token}`, 'POST', data)
      .then((resp: any) => {
        dispatch(updatePasswordInviteLoading(false));
        dispatch(updatePasswordInviteSuccess(resp?.data));
        if (resp.status !== 200 || !resp?.data?.success) {
          const errorMessage = resp?.data?.message || resp?.data?.errors?.[0];
          errorMessage && message.error({
            content: errorMessage,
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

export const getRefreshToken = (data: any, callbackFunction: () => void) => {
  console.log(data);

  const { token, refreshToken } = data;
  // eslint-disable-next-line no-unused-vars
  return (dispatch: any, getSate: any) => {
    apiCall('authenticate/refresh-token', 'POST', { token, refreshToken })
      .then((resp: any) => {
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

// eslint-disable-next-line no-unused-vars
export const forgotUsername = (data: any, callbackFunction: (messageData: any) => void) => {
  const { email } = data;

  // eslint-disable-next-line no-unused-vars
  return (dispatch: any, getSate: any) => {
    dispatch(forgotUsernameLoading());
    apiCall(`authenticate/forgot-username?email=${email}`, 'POST', {})
      .then((resp: any) => {
        dispatch(forgotUsernameSuccess());
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
        callbackFunction(resp?.data?.message);
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

// eslint-disable-next-line no-unused-vars
export const forgotPassword = (data: any, callbackFunction: (messageData: any) => void) => {
  const { email, username } = data;

  // eslint-disable-next-line no-unused-vars
  return (dispatch: any, getSate: any) => {
    dispatch(forgotPasswordLoading());
    apiCall(`authenticate/forgot-password?userName=${username}&email=${email}`, 'POST', {})
      .then((resp: any) => {
        dispatch(forgotPasswordSuccess());
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
        callbackFunction(resp?.data?.message);
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

// eslint-disable-next-line no-unused-vars
export const resetPassword = (data: any, callbackFunction: (messageData: any) => void) => {
  console.log('reset password api call');

  // eslint-disable-next-line no-unused-vars
  return (dispatch: any, getSate: any) => {
    dispatch(resetPasswordLoading());
    apiCall('authenticate/reset-password', 'POST', data)
      .then((resp: any) => {
        dispatch(resetPasswordSuccess());
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
        callbackFunction(resp?.data?.message);
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

export const setIntervalId = (data: any) => ({
  type: authTypes.SET_INTERVAL_ID,
  payload: data,
});
