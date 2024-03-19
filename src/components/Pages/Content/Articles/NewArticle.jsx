import {Form, Input, Modal, Select} from "antd";
import {useAddArticleMutation} from "../../../../services/articles";
import i18n from "../../../../i18n";
import {useNavigate} from "react-router-dom";
import {useEffect} from "react";

export const NewArticle = ({open, onOk, onCancel, category})=>{

  const [form] = Form.useForm()



  return <Modal
      open={open}
      onOk={()=>{
        form.validateFields().then(values=>{
          onOk(values)
        })
      }}
      onCancel={onCancel}
  >
    <Form
        form={form}
        layout='vertical'
        initialValues={{
          lng: i18n.language
        }}
        name="new_article_from"
    >
      <Form.Item
          name="lng"
          label="Select Language"
          rules={[
            {required: true, message: 'Please select a language'}
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
      <Form.Item
          name="title"
          label="___Article Title"
          rules={[
            {required: true, message: '___Article title is required'}
          ]}
      ><Input /></Form.Item>
    </Form>
  </Modal>

}