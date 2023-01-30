import { pcoActionTypes } from './types';
import { pageLength } from '../../shared/constants/pagination.json';

const initialState = {
  getPcoListLoading: false,
  getPcoListSuccess: false,
  pcoList: [],
  currentPage: 0,
  allPcoCount: 0,
  totalPage: 0,
  selectedId: '',
  addPcoLoading: false,
  addPcoSuccess: false,
  updatePcoLoading: false,
  updatePcoSuccess: false,
};

interface ActionType {
  type: string,
  payload: any,
}

export const pcoReducer = (state = initialState, action: ActionType) => {
  switch (action.type) {
    case pcoActionTypes.GET_PCO_LIST_LOADING:
      return {
        ...state,
        getPcoListLoading: true,
        getPcoListSuccess: false,
      };
    case pcoActionTypes.GET_PCO_LIST_SUCCESS:
      return {
        ...state,
        getPcoListLoading: false,
        getPcoListSuccess: true,
        currentPage: action.payload.currentPage,
        allPcoCount: action.payload.totalPage * pageLength,
        totalPage: action.payload.totalPage,
        pcoList: action.payload.pcoList,
      };
    case pcoActionTypes.GET_PCO_SUGGESTION_LIST_LOADING:
      return {
        ...state,
        getPcoSuggestionListLoading: true,
        getPcoSuggestionListSuccess: false,
      };
    case pcoActionTypes.GET_PCO_SUGGESTION_LIST_SUCCESS:
      return {
        ...state,
        getPcoSuggestionListLoading: false,
        getPcoSuggestionListSuccess: true,
        pcoSuggestionList: action.payload.pcoList,
      };
    case pcoActionTypes.ADD_PCO_LOADING:
      return {
        ...state,
        addPcoLoading: true,
        addPcoSuccess: false,
      };
    case pcoActionTypes.ADD_PCO_SUCCESS:
      return {
        ...state,
        addPcoLoading: false,
        addPcoSuccess: true,
        selectedId: action.payload,
      };
    case pcoActionTypes.UPDATE_PCO_LOADING:
      return {
        ...state,
        updatePcoLoading: true,
        updatePcoSuccess: false,
      };
    case pcoActionTypes.UPDATE_PCO_SUCCESS:
      return {
        ...state,
        updatePcoLoading: false,
        updatePcoSuccess: true,
        pcoList: state?.pcoList.map((data: any) => {
          if (action?.payload?.id === data?.id) {
            return action.payload;
          }
          return data;
        }),
      };
    case pcoActionTypes.DELETE_PCO_LOADING:
      return {
        ...state,
        deletePcoLoading: true,
        deletePcoSuccess: false,
      };
    case pcoActionTypes.DELETE_PCO_SUCCESS:
      return {
        ...state,
        deletePcoLoading: false,
        deletePcoSuccess: true,
      };
    case pcoActionTypes.SET_SELECTED_PCO:
      return {
        ...state,
        selectedId: action.payload,
      };
    default:
      return {
        ...state,
      };
  }
};
