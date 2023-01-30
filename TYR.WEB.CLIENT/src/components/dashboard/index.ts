import { connect } from 'react-redux';
import { getCountCall } from '../../redux/common/action';
import { Dashboard } from './Dashboard';

const mapStateToProps = (state: any) => ({
  getCountLoading: state.common.getCountLoading,
  getCountSuccess: state.common.getCountSuccess,
  counts: state.common.counts,
});

const mapDispatchToProps = (dispatch: any) => ({
  getCountCall: (data: {}, callbackFunction: () => void) => dispatch(getCountCall(data, callbackFunction)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
