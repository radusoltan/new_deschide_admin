import React from "react";
import {Button, Select, Space} from "antd";
import { useDispatch, useSelector } from 'react-redux'
import {logout} from "../features/auth/authSlice";
import i18n from "../i18n";

export const HeaderButtons = () => {
  const dispatch = useDispatch()
  const {Option} = Select

  const handleLogout = () =>{
    dispatch(logout())
  }
  const changeLang = value=>{
    i18n.changeLanguage(value)
  }

  return <div className='header-buttons'>
    <Space>
      <Button onClick={handleLogout}>Log Out</Button>
      <Select defaultValue={i18n.language} onChange={changeLang}>
        <Option value="ro">RO</Option>
        <Option value="ru">RU</Option>
        <Option value="en">EN</Option>
      </Select>
    </Space>
  </div>
}