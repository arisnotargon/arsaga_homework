import React, { useEffect, useRef, useState } from 'react';
import './App.css';

import {DesktopOutlined} from '@ant-design/icons';
import type { MenuProps  } from 'antd';
import { Layout, Menu, theme, Dropdown, Button } from 'antd';

import { showRegistModal, Regist as RegistModal } from './components/regist';
import { showLoginModal, Login as LoginModal } from './components/login';
import { logout as logoutRequest } from './api/request'
import Welcome from './components/welcome';
import BlogList from './components/blogList';

const { Header, Content, Footer, Sider } = Layout;

type MenuItem = Required<MenuProps>['items'][number];

type UserInfoType = {
  userName: string,
  userId: number,
};

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[],
  type?: 'group',
  onSelect?: Function
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
    type
  } as MenuItem;
}
const items: MenuItem[] = [
  getItem('home', 'home', <DesktopOutlined />),
  getItem('Blog list', 'blogList', <DesktopOutlined />),
];

const App: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const [userInfo, setUserInfo] = useState({
    userName: '',
    userId: 0,
  } as UserInfoType);

  const notLogedIn: MenuProps['items'] = [
    {
      key: '1',
      label: (
        <a onClick={() => { showLoginModal() }} href="!#" >
          login
        </a>
      ),
    },
    {
      key: '2',
      label: (
        <a onClick={() => { showRegistModal() }} href="!#">
          regist
        </a>
      ),
    },
  ];

  const logout = () => { 
    setUserInfo({
            userName: '',
            userId: 0,
          });
    localStorage.setItem('jwt', '');
    logoutRequest();
  };

   const logedIn: MenuProps['items'] = [
    {
      key: '1',
      label: (
        <a onClick={logout}>
          logout
        </a>
      ),
    },
   ];
  
  const [mainCompon, setmainCompon] = useState('welcome');

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {/* 左側 */}
      <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
        <div style={{ height: 32, margin: 16, background: 'rgba(255, 255, 255, 0.2)' }} >
          <Dropdown menu={{ items: userInfo.userName.length > 0 ? logedIn : notLogedIn }} placement="bottomLeft" arrow>
            <Button style={{ width: '100%' }} >{ userInfo.userName.length > 0 ? userInfo.userName : 'please login' }</Button>
          </Dropdown>
        </div>
        <Menu
          theme="dark"
          defaultSelectedKeys={['1']}
          mode="inline"
          items={items}
          onSelect={({ key, keyPath, selectedKeys, domEvent }) => {
            setmainCompon(key);
           }
          } />
      </Sider>

      {/* 右側　main */}
      <Layout className="site-layout">
        <Content style={{ margin: '0 16px' }}>
          {
            (() => {
              switch (mainCompon) {
                case 'blogList': 
                  // blog list
                  return <BlogList
                    header={Header}
                    setUserInfo={setUserInfo}
                    logout={logout}
                    userInfo={userInfo}
                  />
                default:
                  return <Welcome header={Header} />
               }
            }) ()
          }

        </Content>
        <Footer style={{ textAlign: 'center' }}>just for fun</Footer>
      </Layout>
      <RegistModal setUserInfo={setUserInfo} />
      <LoginModal setUserInfo={setUserInfo} />
    </Layout>
  );
};

export default App;
export type { UserInfoType }