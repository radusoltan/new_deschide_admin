import {Card, Checkbox, Form, Input, Modal, Spin} from "antd";
import {useAddRoleMutation, useGetRoleQuery, useUpdateRoleMutation} from "../../../../services/users";

export const NewRole = ({open, onOk, onCancel, permissions})=>{
  const [form] = Form.useForm()
  const [addRole] = useAddRoleMutation()
  return <Modal
    open={open}
    onOk={()=>{
      form.validateFields()
        .then(values=>{
          form.resetFields()
          addRole(values)
          onOk()
        })
    }}
    onCancel={()=>onCancel()}
  ><Card>
    <Form form={form} layout="vertical">
      <Form.Item
        name="name"
        label="Role Name"
        rules={[
          {required: true}
        ]}
      ><Input /></Form.Item>
      <Form.Item name="permissions" label="Check Permissions">
        <Checkbox.Group
          options={permissions?.map(permission=>({
            label: permission.name,
            value: permission.id
          }))}
        />
      </Form.Item>
    </Form>
  </Card></Modal>
}

export const EditRole = ({open, onOk, onCancel, role, permissions})=>{

  const [form] = Form.useForm()

  const {data, isLoading} = useGetRoleQuery(role)
  const [updateRole] = useUpdateRoleMutation()

  if (isLoading) return <Spin />

  // const {name, permissions} = data

  return <Modal
    open={open}
    onOk={()=>{

      form.validateFields()
        .then(values=>{
          updateRole({role,body:{...values}})
          form.resetFields()
          onOk()
        })

    }}
    onCancel={onCancel}
  ><Card>
    <Form form={form} layout="vertical" initialValues={{
      name: data?.name,
      permissions: data?.permissions.map(permission=>permission.id)
    }}>
      <Form.Item
          name="name"
          label="Role Name"
          rules={[
            {required: true}
          ]}
      ><Input /></Form.Item>
      <Form.Item name="permissions" label="Check Permissions">
        <Checkbox.Group
            options={permissions?.map(permission=>({
              label: permission.name,
              value: permission.id
            }))}
        />
      </Form.Item>
    </Form>
  </Card></Modal>
}