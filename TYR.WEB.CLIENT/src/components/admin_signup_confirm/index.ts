import { connect } from 'react-redux';
import {
  verifySignupByToken,
} from '../../redux/auth/action';
import { ConfirmPage } from './ConfirmPage';

const mapStateToProps = (state: any) => ({
  tempUserDetail: state.auth.tempUserDetail,
  verifySignupByTokenLoading: state.auth.verifySignupByTokenLoading,
  verifySignupByTokenSuccess: state.auth.verifySignupByTokenSuccess,
});

const mapDispatchToProps = (dispatch: any) => ({
  verifySignupByToken: (data: {}, callbackFunction: () => void) => dispatch(verifySignupByToken(data, callbackFunction)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ConfirmPage);
