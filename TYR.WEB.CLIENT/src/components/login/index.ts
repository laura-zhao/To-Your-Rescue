import { connect } from 'react-redux';
import { loginCall } from '../../redux/auth/action';
import { Login } from './Login';

const mapStateToProps = (state: any) => ({
  loginLoading: state.auth.loginLoading,
});

const mapDispatchToProps = (dispatch: any) => ({
  loginCall: (data: {}, callbackFunction: () => void) => dispatch(loginCall(data, callbackFunction)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Login);
