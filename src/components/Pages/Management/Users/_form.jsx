import {Card, Form, Input, Modal, Select, Spin} from "antd";
import {useAddUserMutation, useGetUserQuery, useUpdateUserMutation} from "../../../../services/users";
import {useEffect, useState} from "react";

export const NewUser = ({open, roles, onOk, onCancel})=>{

  const [form] = Form.useForm()
  const [addUser] = useAddUserMutation()

  return <Modal
    open={open}
    onOk={()=>{
      form.validateFields()
        .then(values=>{
          addUser(values)
          form.resetFields()
          onOk()
        })
    }}
    onCancel={onCancel}
  ><Card>
    <Form form={form}>
      <Form.Item
          name="name"
          label="User Name"
          rules={[
            {required: true}
          ]}
      ><Input /></Form.Item>
      <Form.Item
          name="email"
          label="User Email"
          rules={[
            {required: true},
            { type: 'email' }
          ]}
      ><Input /></Form.Item>
      <Form.Item
          name="selectedRoles"
          label="Select User Role"
      >
        <Select
          mode="multiple"
          options={roles.map(role=>({
            label: role.name,
            value: role.id
          }))}
        />
      </Form.Item>
    </Form>
  </Card></Modal>
}

export const EditUser = ({open, rolesData, user, onOk, onCancel})=>{
  const [form] = Form.useForm()
  const {data, isLoading} = useGetUserQuery(user)
  const [updateUser] = useUpdateUserMutation()


  if (isLoading) return <Spin />

  const {name,email,roles} = data

  return <Modal
    open={open}
    onOk={()=>{
      form.validateFields()
        .then(values=>{
          updateUser({user,body:{...values}})
          form.resetFields()
          onOk()
        })
    }}
    onCancel={onCancel}
  ><Card>
    <Form
      form={form}
      initialValues={{
        name,
        email,
        selectedRoles: roles.map(role=>role.name)
      }}
    >
      <Form.Item
          name="name"
          label="User Name"
          rules={[
            {required: true}
          ]}
      ><Input /></Form.Item>
      <Form.Item
          name="email"
          label="User Email"
          rules={[
            {required: true},
            { type: 'email' }
          ]}
      ><Input /></Form.Item>
      <Form.Item
          name="selectedRoles"
          label="Select User Role"
      >
        <Select
            mode="multiple"
            options={rolesData?.map(role=>({
              label: role.name,
              value: role.id
            }))}
        />
      </Form.Item>
    </Form>
  </Card></Modal>
}