import {Card, Form, Input, Modal, Spin} from "antd";
import {useAddPermissionMutation, useGetPermissionQuery, useUpdatePermissionMutation} from "../../../../services/users";

export const NewPermission = ({open, onOk, onCancel})=>{
  const [form] = Form.useForm()
  const [addPermission] = useAddPermissionMutation()
  return <Modal
    open={open}
    onOk={()=>{
      form.validateFields()
        .then(values=>{
          form.resetFields()
          addPermission({...values})
          onOk()
        })
    }}
    onCancel={()=>onCancel()}
  ><Card>
    <Form form={form}>
      <Form.Item label="Permission" name="name" rules={[
        {required: true}
      ]}><Input /></Form.Item>
    </Form>
  </Card></Modal>
}

export const EditPermission = ({open, permission, onOk, onCancel}) => {

  const [form] = Form.useForm()

  const {data, isLoading} = useGetPermissionQuery(permission)
  const [updatePermission] = useUpdatePermissionMutation()

  if (isLoading) return <Spin />

  const {name} = data

  return <Modal
    open={open}
    onOk={()=>{
      form.validateFields()
        .then(values=>{
          form.resetFields()
          updatePermission({permission,body: {...values}})
          onOk()
        })
    }}
    onCancel={()=>onCancel()}
  ><Card>
    <Form initialValues={{name}} form={form}>
      <Form.Item name="name" label="Permission Name"><Input /></Form.Item>
    </Form>
  </Card></Modal>
}