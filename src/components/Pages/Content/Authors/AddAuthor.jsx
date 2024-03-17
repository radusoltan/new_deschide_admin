import {Form, Modal, Card, Input} from "antd";

export const AddAuthor = ({open, onOk, onCancel}) => {

  const [form] = Form.useForm()

  return <Modal
      open={open}
      onOk={()=>{

        form.validateFields()
          .then(values=>{
            form.resetFields()
            onOk(values)
          })

      }}
      onCancel={onCancel}
  ><Card>
    <Form
      form={form}
    >
      <Form.Item
        name="first_name"
        label="First Name"
        rules={[
          {required: true, message: 'First name is required'}
        ]}
      ><Input /></Form.Item>
      <Form.Item
        name="last_name"
        label="Last Name"
        rules={[
          {required: true, message: 'Last name is required'}
        ]}
      ><Input /></Form.Item>
    </Form>
  </Card></Modal>
}