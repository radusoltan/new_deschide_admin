import { Button, Checkbox, Form, Input } from 'antd'
import { useDispatch, useSelector } from 'react-redux'
import {userLogin} from "../../features/auth/authActions";
import {useEffect} from "react";
import { useNavigate } from 'react-router-dom'

export const Login = () => {
  const {loading, error, userToken} = useSelector(state=>state.auth)
  const dispatch = useDispatch()
  const navigate = useNavigate()


  const onFinish = (values) => {
    dispatch(userLogin({...values}))
  };
  const onFinishFailed = (errorInfo) => {

  };

  useEffect(() => {
    if(userToken){
      console.log('Login', userToken)
      navigate('/')
    }
  }, [userToken]);


  return <Form
      name="basic"
      className="login-form"
      labelCol={{
        span: 8,
      }}
      wrapperCol={{
        span: 16,
      }}

      initialValues={{
        remember: true,
      }}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      autoComplete="off"
  >
    <Form.Item
        label="Email"
        name="email"
        rules={[
          {
            required: true,
            message: 'Please input your Email!',
          },
        ]}
    >
      <Input />
    </Form.Item>

    <Form.Item
        label="Password"
        name="password"
        rules={[
          {
            required: true,
            message: 'Please input your password!',
          },
        ]}
    >
      <Input.Password />
    </Form.Item>

    <Form.Item
        name="remember"
        valuePropName="checked"
        wrapperCol={{
          offset: 8,
          span: 16,
        }}
    >
      <Checkbox>Remember me</Checkbox>
    </Form.Item>

    <Form.Item
        wrapperCol={{
          offset: 8,
          span: 16,
        }}
    >
      <Button type="primary" htmlType="submit">
        Submit
      </Button>
    </Form.Item>
  </Form>
}