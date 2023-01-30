import { connect } from 'react-redux';
import Cookies from 'universal-cookie';
import {
  addPCOCall, updatePCOCall, deletePCOCall, getPcoListCall, setSelectedPco, getPcoListSuggestionCall,
} from '../../redux/pco/action';
import { uploadImageCall, deleteImageCall } from '../../redux/common/action';
import { PCO } from './PCO';

const cookies = new Cookies();

const mapStateToProps = (state: any) => ({
  getPcoListLoading: state.pco.getPcoListLoading,
  getPcoListSuccess: state.pco.getPcoListSuccess,
  pcoList: state.pco.pcoList,
  selectedId: state.pco.selectedId,
  addPcoLoading: state.pco.addPcoLoading,
  addPcoSuccess: state.pco.addPcoSuccess,
  updatePcoLoading: state.pco.updatePcoLoading,
  updatePcoSuccess: state.pco.updatePcoSuccess,
  totalNumber: state.pco.allPcoCount,
  currentPage: state.pco.currentPage,
  userCountryCode: state.auth.countryCode || cookies.get('loginDetails').userCountryCode,
});

const mapDispatchToProps = (dispatch: any) => ({
  addPCOCall: (data: {}, callbackFunction: () => void) => dispatch(addPCOCall(data, callbackFunction)),
  updatePCOCall: (data: {}, callbackFunction: () => void) => dispatch(updatePCOCall(data, callbackFunction)),
  deletePCOCall: (data: {}, callbackFunction: () => void) => dispatch(deletePCOCall(data, callbackFunction)),
  getPcoListCall: (data: {}, callbackFunction: () => void) => dispatch(getPcoListCall(data, callbackFunction)),
  uploadImageCall: (data: {}, callbackFunction: () => void) => dispatch(uploadImageCall(data, callbackFunction)),
  deleteImageCall: (data: {}, callbackFunction: () => void) => dispatch(deleteImageCall(data, callbackFunction)),
  getPcoListSuggestionCall: (data: {}, callbackFunction: () => void) => dispatch(getPcoListSuggestionCall(data, callbackFunction)),
  setSelectedPco: (data: any) => dispatch(setSelectedPco(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(PCO);
