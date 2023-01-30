/* eslint-disable no-unused-vars */
import { connect } from 'react-redux';
import { setSelectedPco } from '../../../redux/pco/action';
import { getAnimalMilestoneListCall, updateAnimalMilestoneListCall } from '../../../redux/animal/action';
import { AnimalMilestone } from './AnimalMilestone';

const mapStateToProps = (state: any) => ({
  getAnimalListLoading: state.animal.getAnimalListLoading,
  getAnimalMilestoneListLoading: state.animal.getAnimalMilestoneListLoading,
  updateAnimalMilestoneLoading: state.animal.updateAnimalMilestoneLoading,
  animalMilestoneList: state.animal.animalMilestoneList,
  selectedAnimalId: state.animal.selectedId,
  animalList: state.animal.animalList,
  selectedPcoId: state.pco.selectedId,
});

const mapDispatchToProps = (dispatch: any) => ({
  getAnimalMilestoneListCall: (data: any, callbackFunction: () => void) => dispatch(getAnimalMilestoneListCall(data, callbackFunction)),
  updateAnimalMilestoneListCall: (data: any, callbackFunction: () => void) => dispatch(updateAnimalMilestoneListCall(data, callbackFunction)),
  setSelectedPco: (data: any) => dispatch(setSelectedPco(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(AnimalMilestone);
