import { connect } from 'react-redux';
import {
  inviteUserCall, getUserListCall, updateUser, deleteUser,
} from '../../redux/user/action';
import { Users } from './Users';

const mapStateToProps = (state: any) => ({
  getUserListLoading: state.user.getUserListLoading,
  getUserListSuccess: state.user.getUserListSuccess,
  deleteUserLoading: state.user.deleteUserLoading,
  deleteUserSuccess: state.user.deleteUserSuccess,
  inviteUserLoading: state.user.inviteUserLoading,
  userList: state.user.userList,
});

const mapDispatchToProps = (dispatch: any) => ({
  getUserListCall: (data: {}, callbackFunction: () => void) => dispatch(getUserListCall(data, callbackFunction)),
  updateUser: (data: {}, callbackFunction: () => void) => dispatch(updateUser(data, callbackFunction)),
  inviteUserCall: (data: {}, callbackFunction: () => void) => dispatch(inviteUserCall(data, callbackFunction)),
  deleteUser: (data: {}, callbackFunction: () => void) => dispatch(deleteUser(data, callbackFunction)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Users);
