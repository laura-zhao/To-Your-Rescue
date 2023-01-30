/* eslint-disable quotes */
/* eslint-disable quote-props */
/* eslint-disable no-unused-vars */
import { message } from 'antd';
import { useNavigate } from 'react-router-dom';
import Cookies from 'universal-cookie';
import { apiCall } from '../../shared/api/apiWrapper';
import { pcoActionTypes } from './types';

const getPcoListLoading = (data: any) => ({
  type: pcoActionTypes.GET_PCO_LIST_LOADING,
  payload: data,
});

const getPcoListSuccess = (data: any) => ({
  type: pcoActionTypes.GET_PCO_LIST_SUCCESS,
  payload: data,
});

const addPcoLoading = (data: any) => ({
  type: pcoActionTypes.ADD_PCO_LOADING,
  payload: data,
});

const addPcoSuccess = (data: any) => ({
  type: pcoActionTypes.ADD_PCO_SUCCESS,
  payload: data,
});

const updatePcoLoading = (data: any) => ({
  type: pcoActionTypes.UPDATE_PCO_LOADING,
  payload: data,
});

const updatePcoSuccess = (data: any) => ({
  type: pcoActionTypes.UPDATE_PCO_SUCCESS,
  payload: data,
});

const deletePcoLoading = (data: any) => ({
  type: pcoActionTypes.DELETE_PCO_LOADING,
  payload: data,
});

const deletePcoSuccess = (data: any) => ({
  type: pcoActionTypes.DELETE_PCO_SUCCESS,
  payload: data,
});

export const setSelectedPco = (data: any) => ({
  type: pcoActionTypes.SET_SELECTED_PCO,
  payload: data,
});

const getPcoSuggestionListLoading = (data: any) => ({
  type: pcoActionTypes.GET_PCO_SUGGESTION_LIST_LOADING,
  payload: data,
});

const getPcoSuggestionListSuccess = (data: any) => ({
  type: pcoActionTypes.GET_PCO_SUGGESTION_LIST_SUCCESS,
  payload: data,
});

export const addPCOCall = (data: any, callbackFunction: (id: any) => void) => {
  const { formData, forceAdd, addConfirmPco } = data;

  return (dispatch: any, getSate: any) => {
    dispatch(addPcoLoading(true));
    apiCall(`PCO/create-PCO?force=${forceAdd}`, 'POST', formData)
      .then((resp: any) => {
        dispatch(addPcoSuccess(resp?.data?.data?.id));
        if (!resp?.data?.success && formData.entityType === 'Person') {
          resp?.data?.errors?.[0] && message.error({
            content: addConfirmPco(resp.data.errors[0]),
            style: {
              marginTop: '2vh',
            },
            key: 'updatable',
            duration: 15,
          });
          return;
        }
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
        callbackFunction(resp?.data?.data?.id);
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

export const updatePCOCall = (data: any, callbackFunction: () => void) => {
  const { id } = data;
  return (dispatch: any, getSate: any) => {
    dispatch(updatePcoLoading(true));
    apiCall(`PCO/update-PCO/${id}`, 'PUT', data)
      .then((resp: any) => {
        dispatch(updatePcoSuccess(resp?.data?.data?.pco));
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

export const deletePCOCall = (data: any, callbackFunction: () => void) => {
  const { id } = data;
  return (dispatch: any, getSate: any) => {
    dispatch(deletePcoLoading(true));
    apiCall(`PCO/delete-PCO/${id}`, 'PATCH', {})
      .then((resp: any) => {
        dispatch(deletePcoSuccess(resp?.data?.data?.pco));
        if (resp.status !== 200 || !resp?.data?.success) {
          const errorMsg = resp?.data?.message || resp?.data?.errors?.[0];
          errorMsg && message.error({
            content: errorMsg,
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

export const getPcoListCall = (data: any, callbackFunction: () => void) => {
  const {
    page, length, searchText, entityType, isDeleted,
  } = data;

  return (dispatch: any, getSate: any) => {
    dispatch(getPcoListLoading(true));
    apiCall(`PCO/get-PCO?Limit=${length}&page=${page}&searchText=${searchText}&entityType=${(entityType === 'all') ? '' : entityType}&isDeleted=${isDeleted}`, 'GET', data)
      .then((resp: any) => {
        dispatch(getPcoListLoading(false));
        if (resp.status !== 200) {
          getPcoListSuccess(false);
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
        const currentResponse = resp?.data?.data;
        const reconstructedData = {
          ...currentResponse,
          data: {
            "currentPage": currentResponse?.currentPage,
            "totalItems": (currentResponse?.totalPage * length) || currentResponse?.totalItems,
            "totalPage": currentResponse?.totalPage,
            "pcoList": currentResponse?.data,
          },
        };
        dispatch(getPcoListSuccess(currentResponse));
        callbackFunction();
      });
  };
};

export const getPcoListSuggestionCall = (data: any, callbackFunction: () => void) => {
  const {
    page, length, searchText, entityType, isDeleted,
  } = data;

  return (dispatch: any, getSate: any) => {
    dispatch(getPcoSuggestionListLoading(true));
    apiCall(`PCO/get-PCO?Limit=${length}&page=${page}&searchText=${searchText}&entityType=${(entityType === 'all') ? '' : entityType}&isDeleted=${isDeleted}`, 'GET', data)
      .then((resp: any) => {
        dispatch(getPcoSuggestionListLoading(false));
        if (resp.status !== 200) {
          getPcoSuggestionListSuccess(false);
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
        const currentResponse = resp?.data?.data;
        const reconstructedData = {
          ...currentResponse,
          data: {
            "currentPage": currentResponse?.currentPage,
            "totalItems": (currentResponse?.totalPage * length) || currentResponse?.totalItems,
            "totalPage": currentResponse?.totalPage,
            "pcoList": currentResponse?.data,
          },
        };
        dispatch(getPcoListSuccess(currentResponse));
        callbackFunction();
      });
  };
};
