import { connect } from 'react-redux';
import {
  getUserDetailByToken, forgotUsername, forgotPassword,
} from '../../redux/auth/action';
import { ForgotUsernamePassword } from './ForgotUsernamePassword';

const mapStateToProps = (state: any) => ({
  forgotUsernameLoading: state.auth.forgotUsernameLoading,
  forgotUsernameSuccess: state.auth.forgotUsernameSuccess,
  forgotPasswordLoading: state.auth.forgotPasswordLoading,
});

const mapDispatchToProps = (dispatch: any) => ({
  getUserDetailByToken: (data: {}, callbackFunction: () => void) => dispatch(getUserDetailByToken(data, callbackFunction)),
  forgotUsername: (data: {}, callbackFunction: () => void) => dispatch(forgotUsername(data, callbackFunction)),
  forgotPassword: (data: {}, callbackFunction: () => void) => dispatch(forgotPassword(data, callbackFunction)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ForgotUsernamePassword);
