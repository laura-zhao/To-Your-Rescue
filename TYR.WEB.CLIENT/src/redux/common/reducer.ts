import { commonActionTypes } from './types';

const initialState = {
  counts: {},
  getCountLoading: false,
  getCountSuccess: false,
};

interface ActionType {
  type: string,
  payload: any,
}

export const commonReducer = (state = initialState, action: ActionType) => {
  switch (action.type) {
    case commonActionTypes.GET_COUNT_LOADING:
      return {
        ...state,
        getCountLoading: true,
        getCountSuccess: false,
      };
    case commonActionTypes.GET_COUNT_SUCCESS:
      return {
        ...state,
        getCountLoading: false,
        getCountSuccess: true,
        counts: action.payload,
      };
    case commonActionTypes.UPLOAD_IMAGE_LOADING:
      return {
        ...state,
        uploadImageLoading: false,
        uploadImageSuccess: true,
      };
    case commonActionTypes.UPLOAD_IMAGE_SUCCESS:
      return {
        ...state,
        uploadImageLoading: false,
        uploadImageSuccess: true,
      };
    case commonActionTypes.DELETE_IMAGE_LOADING:
      return {
        ...state,
        deleteImageLoading: false,
        deleteImageSuccess: true,
      };
    case commonActionTypes.DELETE_IMAGE_SUCCESS:
      return {
        ...state,
        deleteImageLoading: false,
        deleteImageSuccess: true,
      };
    default:
      return {
        ...state,
      };
  }
};
