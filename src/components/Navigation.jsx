import React, {useEffect, useState} from 'react';
import {
  AppstoreOutlined,
  ContainerOutlined,
  DesktopOutlined,
  MailOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  PieChartOutlined,
} from '@ant-design/icons';
import {Button, Menu, Spin} from 'antd';
import {useSelector} from "react-redux";
import {getUserMenu} from "../lib/permissions";
import {useNavigate} from "react-router-dom";

export const Navigation = () => {
  const {permissions, loading} = useSelector(state=>state.auth)
  const [current, setCurrent] = useState('mail');
  const [collapsed, setCollapsed] = useState(false);
  const [menuItems, setMenuItems] = useState()
  const navigate = useNavigate()
  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };
  const onClick = (e) => {
    console.log('click ', e);
    setCurrent(e.key);
    navigate(e.key)

  };



  useEffect(() => {
    if (permissions) setMenuItems(getUserMenu(permissions))
  }, [permissions]);

  return <Menu
      defaultSelectedKeys={['1']}
      defaultOpenKeys={['sub1']}
      mode="inline"
      theme="dark"
      onClick={onClick}
      // inlineCollapsed={collapsed}
      items={menuItems}
  />


}