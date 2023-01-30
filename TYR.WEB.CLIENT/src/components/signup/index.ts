import { connect } from 'react-redux';
import { signUpCall } from '../../redux/auth/action';
import { Signup } from './Signup';

const mapStateToProps = (state: any) => ({
  signupLoading: state.auth.signupLoading,
});

const mapDispatchToProps = (dispatch: any) => ({
  signUpCall: (data: {}, callbackFunction: () => void) => dispatch(signUpCall(data, callbackFunction)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Signup);
