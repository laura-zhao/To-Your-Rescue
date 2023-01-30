import { connect } from 'react-redux';
import {
  getUserDetailByToken,
  updatePasswordInvite,
} from '../../redux/auth/action';
import { Invite } from './Invite';

const mapStateToProps = (state: any) => ({
  tempUserDetail: state.auth.tempUserDetail,
  getUserDetailByTokenLoading: state.auth.getUserDetailByTokenLoading,
  getUserDetailByTokenSuccess: state.auth.getUserDetailByTokenSuccess,
  updatePasswordIniteLoading: state.auth.updatePasswordIniteLoading,
  updatePasswordIniteSuccess: state.auth.updatePasswordIniteSuccess,
});

const mapDispatchToProps = (dispatch: any) => ({
  getUserDetailByToken: (data: {}, callbackFunction: () => void) => dispatch(getUserDetailByToken(data, callbackFunction)),
  updatePasswordInvite: (data: {}, callbackFunction: () => void) => dispatch(updatePasswordInvite(data, callbackFunction)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Invite);
