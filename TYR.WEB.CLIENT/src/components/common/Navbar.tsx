import { Space, Menu, Layout } from 'antd'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components/macro'


const { Header } = Layout

export const Navbar = () => {
  const [view, setView] = useState<string[]>([])

  const handleClick = (e: any) => {
    // TODO: defaultSelectedKeys should be set by the current location
    const routesDef = ['/animals', '/login', '/signup']
    if (routesDef.includes(e.key)) setView([e.key])
  }

  const routesLeft = [
    { path: '/animals', title: 'Animals' },
  ]
  const routesRight = [
    { path: '/login', title: 'Login' },
    { path: '/signup', title: 'Signup' }
  ]

  return (
    <StyledHeader>
      <Space size={30}>
        <Logo>
          <p style={{ height: 31, margin: 0, textAlign: 'center', lineHeight: 2 }}>To Your Rescue</p>
        </Logo>
        <Menu onClick={handleClick} theme='dark' mode='horizontal' selectedKeys={view}>
          {routesLeft.map((route) => (
            <Menu.Item key={route.path}>
              <Link to={route.path}>{route.title}</Link>
            </Menu.Item>
          ))}
        </Menu>
      </Space>
      <Menu onClick={handleClick} theme='dark' mode='horizontal' selectedKeys={view}>
        {routesRight.map((route) => (
          <Menu.Item key={route.path}>
            <Link to={route.path}>{route.title}</Link>
          </Menu.Item>
        ))}
      </Menu>
    </StyledHeader>
  )
}

const StyledHeader = styled(Header)`
  position: fixed;
  z-index: 1;
  width: 100%;
  display: flex;
  justify-content: space-between;
`
const Logo = styled.div`
  float: left;
  width: 120px;
  height: 31px;
  margin: 16px 24px 16px 0;
  background: rgba(255, 255, 255, 0.3);
  color: #fff;
  &.ant-row-rtl .logo {
    float: right;
    margin: 16px 0 16px 24px;
  }
`