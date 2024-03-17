import {Card, Form, Input, Modal, Select, Spin} from "antd";
import {useAddAuthorMutation, useGetAuthorQuery, useUpdateAuthorMutation} from "../../../../services/authors";
import i18n from "../../../../i18n";
import {useEffect, useState} from "react";

export const NewAuthor = ({onOk, onCancel, open}) => {

  const [form] = Form.useForm()

  const [addAuthor] = useAddAuthorMutation()

  return <Modal
      open={open}
      onOk={()=>{
        form.validateFields()
            .then(values=>{
              form.resetFields()
              addAuthor({...values, locale: i18n.language})
            })
        onOk()
      }}
      onCancel={()=>{
        onCancel()
      }}
  >
    <Card>

      <Form
          form={form}
          name="new_author_form"
          layout="vertical"
      >
        <Form.Item
            name="first_name"
            label="First Name"
            rules={[
              {required:true,message: 'First Name is required'}
            ]}
        ><Input /></Form.Item>
        <Form.Item
            name="last_name"
            label="Last Name"
            rules={[
              {required:true,message: 'Last Name is required'}
            ]}
        ><Input /></Form.Item>
        <Form.Item
            name="email"
            label="Email"
            rules={[
              {required:true,message: 'Email is required'}
            ]}
        ><Input /></Form.Item>
      </Form>

    </Card>
  </Modal>
}
export const EditAuthor = ({author, onOk, onCancel, open}) => {

  const [form] = Form.useForm()

  const {data, isLoading} = useGetAuthorQuery(author)
  const [updateAuthor] = useUpdateAuthorMutation()

  if (isLoading) return <Spin />

  const formValues = data?.translations.find(translation=>translation.locale===i18n.language)


  return <Modal
      open={open}
      onOk={()=>{
        form.validateFields()
            .then(values=>{
              updateAuthor({author,body: {...values, locale: i18n.language}})

            })
        onOk()
      }}
      onCancel={()=>{
        onCancel()
      }}
  >
    <Card loading={isLoading}>
      <Form
          form={form}
          name="edit_author_form"
          layout="vertical"
          initialValues={{
            first_name: formValues ? formValues.first_name : 'No trans',
            last_name: formValues ? formValues.last_name : 'No trans',
            email: data?.email,
          }}
      >
        <Form.Item
            name="first_name"
            label="First Name"
            rules={[
              {required:true,message: 'First Name is required'}
            ]}
        ><Input /></Form.Item>
        <Form.Item
            name="last_name"
            label="Last Name"
            rules={[
              {required:true,message: 'Last Name is required'}
            ]}
        ><Input /></Form.Item>
        <Form.Item
            name="email"
            label="Email"
            rules={[
              {required:true,message: 'Email is required'}
            ]}
        ><Input /></Form.Item>
      </Form>
    </Card>
  </Modal>
}
export const TranslateAuthor = ({author, onOk, onCancel, open}) => {

  const [form] = Form.useForm()

  const {data, isLoading} = useGetAuthorQuery(author)

  const [updateAuthor] = useUpdateAuthorMutation()

  if (isLoading) return <Spin />

  const formValues = data?.translations.find(translation=>translation.locale===i18n.language)

  return <Modal
      open={open}
      onOk={()=>{
        form.validateFields()
          .then(values=>{
            form.resetFields()
            updateAuthor({author, body: {...values}})
          })
        onOk()
      }}
      onCancel={()=>{
        onCancel()
      }}
  >
    <Card loading={isLoading}>
      <Form
        form={form}
        name="edit_author_form"
        layout="vertical"
        initialValues={{
          first_name: formValues ? formValues.first_name : "No trans" ,
          last_name: formValues ? formValues.last_name : "No trans",
          email: data?.email,
          locale: i18n.language
        }}
      >
        <Form.Item
          name='first_name'
          label="First Name"
          rules={[
            { required: true, message: "First Name is required" }
          ]}
        ><Input /></Form.Item>
        <Form.Item
          name='last_name'
          label="Last Name"
          rules={[
            { required: true, message: "Last Name is required" }
          ]}
        ><Input /></Form.Item>
        <Form.Item
          name='locale'
          label="Locale"
          rules={[
            { required: true, message: 'Select locale' }
          ]}
        >
          <Select
            options={[
              {value: 'ro', label: 'Romana'},
              {value: 'en', label: 'English'},
              {value: 'ru', label: 'Russian'},
            ]}
          />
        </Form.Item>
      </Form>

    </Card>
  </Modal>
}