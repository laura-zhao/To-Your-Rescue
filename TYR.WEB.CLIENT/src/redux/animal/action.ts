/* eslint-disable quotes */
/* eslint-disable quote-props */
/* eslint-disable no-unused-vars */
import { message } from 'antd';
import { useNavigate } from 'react-router-dom';
import Cookies from 'universal-cookie';
import { apiCall } from '../../shared/api/apiWrapper';
import { animalActionTypes } from './types';

const getAnimalListLoading = (data: any) => ({
  type: animalActionTypes.GET_ANIMAL_LIST_LOADING,
  payload: data,
});

const getAnimalListSuccess = (data: any) => ({
  type: animalActionTypes.GET_ANIMAL_LIST_SUCCESS,
  payload: data,
});

const addAnimalLoading = (data: any) => ({
  type: animalActionTypes.ADD_ANIMAL_LOADING,
  payload: data,
});

const addAnimalSuccess = (data: any) => ({
  type: animalActionTypes.ADD_ANIMAL_SUCCESS,
  payload: data,
});

const updateAnimalLoading = (data: any) => ({
  type: animalActionTypes.UPDATE_ANIMAL_LOADING,
  payload: data,
});

const updateAnimalSuccess = (data: any) => ({
  type: animalActionTypes.UPDATE_ANIMAL_SUCCESS,
  payload: data,
});

const deleteAnimalLoading = (data: any) => ({
  type: animalActionTypes.DELETE_ANIMAL_LOADING,
  payload: data,
});

const deleteAnimalSuccess = (data: any) => ({
  type: animalActionTypes.DELETE_ANIMAL_SUCCESS,
  payload: data,
});

const getAnimalSuggestionListLoading = (data: any) => ({
  type: animalActionTypes.GET_ANIMAL_SUGGESTION_LIST_LOADING,
  payload: data,
});

const getAnimalSuggestionListSuccess = (data: any) => ({
  type: animalActionTypes.GET_ANIMAL_SUGGESTION_LIST_SUCCESS,
  payload: data,
});

export const setSelectedAnimal = (data: any) => ({
  type: animalActionTypes.SET_SELECTED_ANIMAL,
  payload: data,
});

const getAnimalMilestoneListLoading = (data: any) => ({
  type: animalActionTypes.GET_ANIMAL_MILESTONE_LIST_LOADING,
  payload: data,
});

const getAnimalMilestoneListSuccess = (data: any) => ({
  type: animalActionTypes.GET_ANIMAL_MILESTONE_LIST_SUCCESS,
  payload: data,
});

const updateAnimalMilestoneLoading = () => ({
  type: animalActionTypes.UPDATE_ANIMAL_MILESTONE_LOADING,
});

const updateAnimalMilestoneSuccess = () => ({
  type: animalActionTypes.UPDATE_ANIMAL_MILESTONE_SUCCESS,
});

export const addAnimalCall = (data: any, callbackFunction: (selectedIds: any) => void) => {
  const {
    noOfAnimal, noOfMale, noOfFemale, noOfUnknown, formData,
  } = data;

  return (dispatch: any, getSate: any) => {
    dispatch(addAnimalLoading(true));
    apiCall(`animal/create-animal?noofAnimals=${noOfAnimal}&male=${noOfMale}&female=${noOfFemale}&unknown=${noOfUnknown}`, 'POST', formData)
      .then((resp: any) => {
        dispatch(addAnimalSuccess(resp?.data?.data));
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
        const selectedIds: any = [];
        resp?.data?.data?.map((animalData: any) => {
          selectedIds.push(animalData?.id);
          return '';
        });
        callbackFunction(selectedIds);
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

export const updateAnimalCall = (data: any, callbackFunction: () => void) => {
  const { id } = data;
  return (dispatch: any, getSate: any) => {
    dispatch(updateAnimalLoading(true));
    apiCall(`animal/Update-animal?Id=${id}`, 'PUT', data)
      .then((resp: any) => {
        dispatch(updateAnimalSuccess(resp?.data?.data?.animal));
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

export const deleteAnimalCall = (data: any, callbackFunction: () => void) => {
  const { id } = data;
  return (dispatch: any, getSate: any) => {
    dispatch(deleteAnimalLoading(true));
    apiCall(`animal/delete-animal/${id}`, 'PATCH', {})
      .then((resp: any) => {
        dispatch(deleteAnimalSuccess(resp?.data?.data?.pco));
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

export const getAnimalListCall = (data: any, callbackFunction: () => void) => {
  const {
    page, length, searchText, isAvailable, isDeleted,
  } = data;

  return (dispatch: any, getSate: any) => {
    dispatch(getAnimalListLoading(true));
    apiCall(`animal/get-animal?Limit=${length}&Page=${page}&searchText=${searchText}&isAvailable=${isAvailable}&isDeleted=${isDeleted}`, 'GET', data)
      .then((resp: any) => {
        dispatch(getAnimalListLoading(false));
        if (resp.status !== 200) {
          getAnimalListSuccess(false);
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
        dispatch(getAnimalListSuccess(currentResponse));
        callbackFunction();
      });
  };
};

export const getAnimalListSuggestionCall = (data: any, callbackFunction: () => void) => {
  const {
    page, length, searchText, entityType, isDeleted,
  } = data;

  return (dispatch: any, getSate: any) => {
    dispatch(getAnimalSuggestionListLoading(true));
    apiCall(`PCO/get-PCO?Limit=${length}&page=${page}&searchText=${searchText}&entityType=${(entityType === 'all') ? '' : entityType}&isDeleted=${isDeleted}`, 'GET', data)
      .then((resp: any) => {
        dispatch(getAnimalSuggestionListLoading(false));
        if (resp.status !== 200) {
          getAnimalSuggestionListSuccess(false);
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
        dispatch(getAnimalListSuccess(currentResponse));
        callbackFunction();
      });
  };
};

export const getAnimalMilestoneListCall = (data: any, callbackFunction: () => void) => {
  // const {
  //   page, length, searchText, entityType, isDeleted, animalId,
  // } = data;

  const { animalId, page, length } = data;

  return (dispatch: any, getSate: any) => {
    dispatch(getAnimalMilestoneListLoading(true));
    // ?Limit=${length}&page=${page}&searchText=${searchText}&entityType=${(entityType === 'all') ? '' : entityType}&isDeleted=${isDeleted}
    apiCall(`animal-milestone/get-animal-milestone-animalid/${animalId}?limit=${length}&page=${page}`, 'GET', data)
      .then((resp: any) => {
        dispatch(getAnimalMilestoneListLoading(false));
        if (resp.status !== 200) {
          getAnimalMilestoneListSuccess(false);
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
        dispatch(getAnimalMilestoneListSuccess(currentResponse));
        callbackFunction();
      });
  };
};

export const updateAnimalMilestoneListCall = (data: any, callbackFunction: () => void) => {
  const { milestoneId } = data;

  return (dispatch: any, getSate: any) => {
    dispatch(updateAnimalMilestoneLoading());
    // ?Limit=${length}&page=${page}&searchText=${searchText}&entityType=${(entityType === 'all') ? '' : entityType}&isDeleted=${isDeleted}
    apiCall(`animal-milestone/update-animal-milestone/${milestoneId}`, 'POST', data)
      .then((resp: any) => {
        dispatch(updateAnimalMilestoneSuccess());
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
      });
  };
};
