import { useDispatch, useSelector } from 'react-redux'
import {useGetUserDetailsQuery} from "../services/auth";
import React, {useEffect, useState} from "react";
import {setCredentials, logout} from "../features/auth/authSlice";
import {Outlet} from "react-router-dom";
import { Layout, Menu, Select, Button, Space } from 'antd'
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
} from '@ant-design/icons'
import {HeaderButtons} from "./HeaderButtons";
import {useNavigate} from "react-router-dom";
import {Navigation} from "./Navigation";

export const Protected = () => {

  const { Header, Sider, Content } = Layout
  const dispatch = useDispatch()
  const [collapsed,setCollapsed] = useState(false)
  const {data: user, error} = useGetUserDetailsQuery('userDetails',{
    pollingInterval: 100000
  })

  const toggle = () => {
    setCollapsed(!collapsed)
  }

  useEffect(() => {
    if (user){

      dispatch(setCredentials(user))
    }
    if (error){
      dispatch(logout())

    }
  }, [user, dispatch, error]);

  return !user ? <>Not User</> : <Layout>

    <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        breakpoint="lg"
    >
      <>
        <h1 style={{
          color: 'white',
          padding: '5px'
        }}>DESCHIE.MD | ADMIN</h1>
      </>
      <Navigation/>
    </Sider>

    <Layout className="site-layout">
      <Header className="site-layout-background" style={{ padding: 0 }}>
        {React.createElement(
          collapsed ? MenuUnfoldOutlined : MenuFoldOutlined,
          {
            className: "trigger",
            onClick: toggle,
          }
        )}
        <HeaderButtons />
      </Header>
      <Content>
        <Outlet/>
      </Content>
    </Layout>


  </Layout>
}