import axios from 'axios';
import { message } from 'antd';
import moment from 'moment';
import Cookies from 'universal-cookie';
import { baseUrl } from '../../config';
import alertConstant from '../constants/alert.json';
import { refreshTokenTime, loginMaxAge } from '../constants/auth.json';

const AxiosInstanceOne = axios.create();
const AxiosInstanceTwo = axios.create();
const cookies = new Cookies();

const getRefreshToken = async (axiosOption: any) => {
  const token = cookies.get('loginDetails')?.token;
  const refreshToken = cookies.get('loginDetails')?.refreshToken;
  const newAxiosOption = {
    ...axiosOption,
    data: { token, refreshToken },
    url: `${baseUrl}authenticate/refresh-token`,
    method: 'POST',
  };
  return new Promise((resolve) => {
    AxiosInstanceOne(newAxiosOption)
      .then((response) => {
        resolve(response);
      })
      .catch((error) => {
        if (error.response) {
          const errorMsg = error?.response?.data?.message;
          message.error({
            content: (errorMsg || alertConstant.server_error),
            style: {
              marginTop: '2vh',
            },
            key: 'updatable',
          });
        } else {
          message.error({
            content: alertConstant.server_error,
            style: {
              marginTop: '2vh',
            },
            key: 'updatable',
          });
        }
        resolve(true);
      });
  });
};

export const apiCall = (endPoint: string, methodType: any, data: any) => {
  let token = cookies.get('loginDetails')?.token;

  const axiosOption = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    url: `${baseUrl}${endPoint}`,
    method: methodType,
    timeout: 120000,
    data,
  };

  AxiosInstanceTwo.interceptors.request.use(async (config) => {
    const loginDetails = cookies.get('loginDetails');
    const expireAt = loginDetails?.expireAt;
    const isSessionLoggedIn = loginDetails?.sessionLogin;
    if (moment().isAfter(moment(expireAt))) {
      const newTokenDetail: any = await getRefreshToken(axiosOption);
      const newToken = newTokenDetail?.data?.token;
      const newRefreshToken = newTokenDetail?.data?.refreshToken;

      if (newToken && newRefreshToken) {
        token = newTokenDetail?.data?.token;
        cookies.set('loginDetails', {
          ...loginDetails,
          token: newToken,
          refreshToken: newRefreshToken,
          expireAt: moment(Date.now()).add(refreshTokenTime, 'minute').format('YYYY-MM-DDTHH:mm:ssZz'),
        }, isSessionLoggedIn ? { path: '/' } : { path: '/', maxAge: loginMaxAge });
      }
    }
    return config;
  }, () => {
    message.error({
      content: alertConstant.authentication_error,
      style: {
        marginTop: '2vh',
      },
      key: 'updatable',
    });
  });

  return new Promise((resolve) => {
    AxiosInstanceTwo({
      ...axiosOption,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        resolve(response);
      })
      .catch((error) => {
        if (error.response) {
          const errorMsg = error?.response?.data?.errors?.[0];
          const errorMsg2 = error?.response?.data?.message;
          message.error({
            content: (errorMsg || errorMsg2 || alertConstant.server_error),
            style: {
              marginTop: '2vh',
            },
            key: 'updatable',
          });
        } else {
          message.error({
            content: alertConstant.server_error,
            style: {
              marginTop: '2vh',
            },
            key: 'updatable',
          });
        }
        resolve(error?.response);
      });
  });
};
