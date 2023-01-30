import { connect } from 'react-redux';
import { Animals } from './FtrAnimals';
import {
  addAnimalCall, getAnimalListCall, updateAnimalCall, deleteAnimalCall, setSelectedAnimal, getAnimalMilestoneListCall,
} from '../../redux/animal/action';
import { uploadImageCall, deleteImageCall } from '../../redux/common/action';
import {
  setSelectedPco,
} from '../../redux/pco/action';

const mapStateToProps = (state: any) => ({
  getAnimalListLoading: state.animal.getAnimalListLoading,
  getAnimalListSuccess: state.animal.getAnimalListSuccess,
  animalList: state.animal.animalList,
  selectedAnimalId: state.animal.selectedId,
  selectedPcoId: state.pco.selectedId,
  addAnimalLoading: state.animal.addAnimalLoading,
  addAnimalSuccess: state.animal.addAnimalSuccess,
  updateAnimalLoading: state.animal.updateAnimalLoading,
  updateAnimalSuccess: state.animal.updateAnimalSuccess,
  totalNumber: state.animal.allAnimalCount,
  currentPage: state.animal.currentPage,
  pcoList: state.pco.pcoList,
});

const mapDispatchToProps = (dispatch: any) => ({
  addAnimalCall: (data: any, callbackFunction: () => void) => dispatch(addAnimalCall(data, callbackFunction)),
  setSelectedPcoId: (data: any) => dispatch(setSelectedPco(data)),
  setSelectedAnimal: (data: any) => dispatch(setSelectedAnimal(data)),
  getAnimalListCall: (data: any, callbackFunction: () => void) => dispatch(getAnimalListCall(data, callbackFunction)),
  getAnimalListSuggestionCall: (data: any, callbackFunction: () => void) => dispatch(addAnimalCall(data, callbackFunction)),
  updateAnimalCall: (data: any, callbackFunction: () => void) => dispatch(updateAnimalCall(data, callbackFunction)),
  deleteAnimalCall: (data: any, callbackFunction: () => void) => dispatch(deleteAnimalCall(data, callbackFunction)),
  getAnimalMilestoneListCall: (data: any, callbackFunction: () => void) => dispatch(getAnimalMilestoneListCall(data, callbackFunction)),
  uploadImageCall: (data: any, callbackFunction: () => void) => dispatch(uploadImageCall(data, callbackFunction)),
  deleteImageCall: (data: any, callbackFunction: () => void) => dispatch(deleteImageCall(data, callbackFunction)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Animals);
