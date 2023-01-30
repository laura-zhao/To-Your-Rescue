/* eslint-disable no-unused-vars */
const baseUrlOld = (process.env.NODE_ENV === 'production' ? 'https://localhost:5001/api/' : 'https://localhost:5001/api/');
const localUrl = 'https://localhost:5001/api/';
/* eslint-disable no-unused-vars */
const devUrl = 'https://tyr-api.azurewebsites.net/api/';

const baseUrl = devUrl; // changes the variable name here to change the api url

export { baseUrl };
