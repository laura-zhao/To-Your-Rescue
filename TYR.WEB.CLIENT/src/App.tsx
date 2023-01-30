import { FC, useEffect, useState } from 'react';
import {
  Layout,
  Menu,
  Avatar,
  message,
  Button,
  Popover,
} from 'antd';
import { connect } from 'react-redux';
import './App.less';
import { UserOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import {
  Routes, Route, Link, useLocation, useNavigate,
} from 'react-router-dom';
import Cookies from 'universal-cookie';
import Animals from './components/animals';
import PCO from './components/pco';
import Customization from './components/customization';
import Users from './components/users';
import { Searches } from './components/searches/FtrSearches';
import { Queries } from './components/queries/FtrQueries';
import { Reports } from './components/reports/FtrReports';
import { Help } from './components/help/FtrHelp';
// import { About } from './components/about/FtrAbout';
import Signup from './components/signup';
import Login from './components/login';
import Dashboard from './components/dashboard';
import LandingPage from './components/landing';
import Invite from './components/invite';
import ConfirmPage from './components/admin_signup_confirm';
import { apiCall } from './shared/api/apiWrapper';
import AnimalMilestone from './components/animals/milestones';
import ForgotUsernamePassword from './components/forgot_password_username';
import ResetPassword from './components/ResetPassword';
import BreadCrumb from './shared/components/BreadCrumb';

interface IState {
}

const { Header, Content, Footer } = Layout;

export const isBrowser = !!(typeof window !== 'undefined' && window.document && window.document.createElement);

const StyledLayout = styled(Layout)`
  position: relative;
  height: 100vh;
`;
const StyledContent = styled(Content)`
  padding: 0 50px;
  margin-top: 64px;
  height: 100vh;
  overflow: hidden auto;
  & .site-layout-content {
    min-height: 380px;
    padding: 24px;
    background: #fff;
  }
  @media only screen and (max-width: 600px) {
    padding: 20px;
  }
`;
const StyledHeader = styled(Header)`
  position: fixed;
  z-index: 1;
  width: 100%;
  display: flex;
  justify-content: flex-start;
`;

const Logo = styled.div`
  float: left;
  width: 160px;
  height: 31px;
  margin: 16px 24px 16px 0;
  background: rgba(255, 255, 255, 0.3);
  color: #fff;
  cursor: pointer;
  &.ant-row-rtl .logo {
    float: right;
    margin: 16px 0 16px 24px;
  }
`;

const App: FC<any> = ({ login }) => {
  const navigate = useNavigate();
  const [view, setView] = useState<string[]>([]);
  const [isLogin, setLogin] = useState(false);
  const authExludedRoutes = ['/login', '/signup', '/', '/auth', '/forgot-username', '/forgot-password'];
  const [tenantName, setTenantName] = useState('To Your Rescue');
  const location = useLocation().pathname;

  const cookies = new Cookies();
  const isLogged = cookies.get('login');

  useEffect(() => {
    if (isLogged) {
      const data = {};
      apiCall('tenant/get-tenant-info', 'GET', data)
        .then((resp: any) => {
          if (resp?.data?.success) {
            const tenantLoginName = resp?.data?.data?.tenant?.name;
            const tenantAcronym = resp?.data?.data?.tenant?.tenantAcronym;
            setTenantName(tenantLoginName?.length < 35 ? tenantLoginName : tenantAcronym);
            localStorage.setItem('countryId', resp?.data?.data?.tenant?.countryId);
          }
        });
    }
  }, [isLogged]);

  useEffect(() => {
    location && setView([location]);
    const isLoggedOut = !cookies.get('login');

    if (isLoggedOut) {
      const newLocation = location.split('/')[1];
      // eslint-disable-next-line prefer-template
      if (location === '/') {
        navigate('/');
      } else if (location === '/signup') {
        navigate('/signup');
      } else if (location.split('/auth')[1]) {
        // navigate(location);
      } else if (authExludedRoutes.includes(`/${newLocation}`)) {
        navigate(`${location}`);
      } else {
        console.log('triggering logout 3');
        navigate('/login');
      }
    } else if (authExludedRoutes.includes(location)) {
      navigate('/');
    }
    const isLoggedIn = cookies.get('login');
    setLogin(isLoggedIn);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);

  const handleClickHelp = () => {
    window.open('https://www.toyourrescue.org/TYR-User-Guide-V2/index.htm');
  };

  const handleClick = (e: any) => {
    const routesDef = ['/animals', '/pco', '/searches', '/queries', '/donations', '/customization', '/reports', '/help', '/login', '/signup'];
    if (routesDef.includes(e.key)) setView([e.key]);
  };

  const basicRoutes = [
    { path: '/animals', title: 'Animals' },
    { path: '/pco', title: 'PCOs' },
    { path: '/searches', title: 'Searches' },
    { path: '/queries', title: 'Queries' },
    { path: '/reports', title: 'Reports' },
    { path: '/customization', title: 'Customization' },
    { path: '#', title: 'Help' },
  ];

  let routesLeft = [];

  if ((cookies.get('loginDetails')?.userType === 'Administrator')) {
    routesLeft = [...basicRoutes, { path: '/users', title: 'Users' }];
  } else {
    routesLeft = [...basicRoutes];
  }

  // const routesRight = [
  //   { path: '/login', title: 'Login' },
  //   { path: '/signup', title: 'Signup' },
  // ];

  const onLogout = (sesstionExpire: boolean) => {
    sesstionExpire ? message.error('Session Expire', 1.5) : message.success('Logout Successful', 1.5);
    cookies.remove('login', { path: '/' });
    cookies.remove('loginDetails', { path: '/' });
    setTenantName('To Your Rescue');
    setLogin(false);
    navigate('/login');
  };

  const navigateToHomePage = () => {
    const isLoggedOut = !cookies.get('login');

    if (isLoggedOut) {
      navigate('/');
    } else {
      navigate('/');
    }
  };

  useEffect(() => {
    if (!login) {
      return;
    }
    setInterval(() => {
      const isLoggedIn = cookies.get('login');
      if (!isLoggedIn && !authExludedRoutes.includes(`/${window.location?.pathname?.split('/')?.[0]}`)) {
        onLogout(true);
      }
      if (isLoggedIn && authExludedRoutes.includes(window.location.pathname)) {
        navigate('/');
      }
    }, 1000);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [login]);

  useEffect(() => {
    if (isBrowser) setView([window.location.pathname]);
    setInterval(() => {
      const isLoggedIn = cookies.get('login');
      if (!isLoggedIn && !authExludedRoutes.includes(`/${window.location?.pathname?.split('/')?.[0]}`)) {
        onLogout(true);
      }
      if (isLoggedIn && authExludedRoutes.includes(window.location.pathname)) {
        navigate('/');
      }
    }, 1000);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <StyledLayout>
      <StyledHeader>
        <Logo onClick={navigateToHomePage} style={{ width: `${tenantName ? (tenantName?.length * 9) : 100}px` }}>
          <p style={{
            height: 31, margin: 0, textAlign: 'center', lineHeight: 2,
          }}
          >
            {tenantName}
          </p>
        </Logo>
        {isLogin
          && (
            <Menu className="menu-left" onClick={handleClick} theme="dark" mode="horizontal" selectedKeys={view}>
              {routesLeft.map((route) => (
                <Menu.Item key={route.path}>
                  {route.title === 'Help'
                    ? <Link to="#" target="_blank" onClick={handleClickHelp}>{route.title}</Link>
                    : <Link to={route.path}>{route.title}</Link>}
                </Menu.Item>
              ))}
            </Menu>
          )}

        {isLogin
          && (
            <>
              <Menu theme="dark" mode="horizontal" selectedKeys={view}>
                <Popover
                  placement="bottom"
                  content={(
                    <Button
                      style={{
                        textAlign: 'center', cursor: 'pointer',
                      }}
                      onClick={() => onLogout(false)}
                    >
                      <div>Logout</div>
                    </Button>
                  )}
                  trigger="click"
                >
                  <div style={{
                    height: 31, marginTop: '4px', marginLeft: '20px', textAlign: 'center', cursor: 'pointer', lineHeight: 1.5,
                  }}
                  >
                    <Avatar size={35} icon={<UserOutlined />} />
                    <p>{cookies.get('loginDetails')?.user || 'Dummy User'}</p>
                  </div>
                </Popover>
              </Menu>
            </>
          )}
      </StyledHeader>
      <StyledContent>
        {isLogged && <BreadCrumb />}
        <Routes>
          {isLogged
            ? <Route path="/" element={<Dashboard />} />
            : <Route path="/" element={<LandingPage />} />}
          <Route path="animals/*" element={<Animals />} />
          <Route path="animals/milestone" element={<AnimalMilestone />} />
          <Route path="pco/*" element={<PCO />} />
          <Route path="searches/*" element={<Searches />} />
          <Route path="queries/*" element={<Queries />} />
          <Route path="reports/*" element={<Reports />} />
          <Route path="customization/*" element={<Customization />} />
          <Route path="#" element={<Help />} />
          {(cookies.get('loginDetails')?.userType === 'Administrator') && <Route path="/users" element={<Users />} />}
          <Route path="signup/*" element={<Signup />} />
          <Route path="login/*" element={<Login />} />
          <Route path="/auth/verify/*" element={<Invite />} />
          <Route path="/auth/verify-signup/*" element={<ConfirmPage />} />
          <Route path="/forgot-username" element={<ForgotUsernamePassword />} />
          <Route path="/forgot-password" element={<ForgotUsernamePassword />} />
          <Route path="/auth/reset-password/*" element={<ResetPassword />} />
          <Route path="*" />
        </Routes>
        <Footer style={{ textAlign: 'center' }}>{`To Your Rescue ©${new Date().getFullYear()}`}</Footer>
      </StyledContent>
    </StyledLayout>
  );
};

const mapStateToProps = (state: any) => ({
  login: state.auth.login,
});

export default connect<IState, null>(mapStateToProps, null)(App);
