import { connect } from 'react-redux';
import {
  resetPassword,
} from '../../redux/auth/action';
import { ResetPassword } from './ResetPassword';

const mapStateToProps = (state: any) => ({
  forgotPasswordLoading: state.auth.forgotPasswordLoading,
});

const mapDispatchToProps = (dispatch: any) => ({
  resetPassword: (data: {}, callbackFunction: () => void) => dispatch(resetPassword(data, callbackFunction)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ResetPassword);
