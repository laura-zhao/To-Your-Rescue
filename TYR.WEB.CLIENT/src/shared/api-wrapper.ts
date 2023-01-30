import axios, { Method } from 'axios';
import { log } from 'console';

export const getApiRequest = async (url = '', data: {}, method: Method = 'GET') => {
  try {
    let loginDetail:any = localStorage.getItem('loginDetails');
    loginDetail = loginDetail || {};
    log(loginDetail, '---INTERCEPTOR---');
    const res = await axios({
      method,
      url,
      data,
      withCredentials: true,
      headers: { 'Content-Type': 'application/json' },
    });
    return res.data;
  } catch (err) {
    return console.log(err);
  }
};
