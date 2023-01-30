import { connect } from 'react-redux';
import { LandingPage } from './LandingPage';

const mapStateToProps = (state: any) => ({
  loginLoading: state.auth.loginLoading,
});

export default connect(mapStateToProps, null)(LandingPage);
