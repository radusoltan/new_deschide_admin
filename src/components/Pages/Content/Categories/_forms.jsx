import {Form, Input, Modal, Switch, Select, Spin, Divider} from "antd";
import {useAddCategoryMutation, useGetCategoryQuery, useUpdateCategoryMutation} from "../../../../services/categories";
import i18n from '../../../../i18n'

export const NewCategory = ({open, onOk, onCancel}) => {

  const [form] = Form.useForm()

  const [addCategory] = useAddCategoryMutation()

  return <Modal
      open={open}
      onOk={()=>{
        form.validateFields()
            .then(values=>{

              addCategory({...values})
              form.resetFields()
              onOk()
            })
      }}
      onCancel={onCancel}
  >
    <Form
        form={form}
        layout="vertical"
        name="new_category_form"
        initialValues={{
          in_menu: false
        }}
    >
      <Form.Item
          label="Title"
          name='title'
          rules={[
            {required:true,message: 'Title is required'}
          ]}
      ><Input /></Form.Item>
      <Form.Item
          name='lng'
          label="Select Language"
          rules={[
            {required: true}
          ]}
      >
        <Select
            defaultValue='ro'
            options={[
              {value: 'ro', label: 'Romana'},
              {value: 'en', label: 'English'},
              {value: 'ru', label: 'Russian'},
            ]}
        />
      </Form.Item>
      <Form.Item
          label="In Menu"
          name="in_menu"
          valuePropName="checked"
      >
        <Switch defaultChecked={false} />
      </Form.Item>

    </Form>
  </Modal>
}

export const EditCategory = ({open, onOk, onCancel, id}) => {

  const [form] = Form.useForm()

  const {data, isLoading} = useGetCategoryQuery(id)
  const [updateCategory,{isSuccess}] = useUpdateCategoryMutation()

  if (isLoading) return <Spin />

  const {translations, in_menu, title} = data

  return <Modal
      open={open}
      onOk={()=>{
        form.validateFields().then(
            values => {
              form.resetFields()
              updateCategory({id, body: {...values}})
              onOk()
            }
        )



      }}
      onCancel={()=>{
        form.resetFields()
        onCancel()
      }}
  >
    <Form
        form={form}
        layout="vertical"
        name="new_category_form"
        initialValues={{
          in_menu,
          title: translations?.find(({locale})=>i18n.language===locale) ? translations?.find(({locale})=>i18n.language===locale).title : 'Notitle',
          lng: i18n.language
        }}
    >
      <Form.Item
          label="Title"
          name='title'
          rules={[
            {required:true,message: 'Title is required'}
          ]}
      ><Input /></Form.Item>
      <Form.Item
          name='lng'
          label="Select Language"
          rules={[
            {required: true}
          ]}
      >
        <Select
            defaultValue={i18n.language}
            options={[
              {value: 'ro', label: 'Romana'},
              {value: 'en', label: 'English'},
              {value: 'ru', label: 'Russian'},
            ]}
        />
      </Form.Item>
      <Form.Item
          label="In Menu"
          name="in_menu"
          valuePropName="checked"
      >
        <Switch />
      </Form.Item>

    </Form>
  </Modal>
}

export const TranslateCategory = ({ open, onOk, onCancel, id })=>{
  const [form] = Form.useForm()
  const {data, isLoading} = useGetCategoryQuery(id)
  const [updateCategory] = useUpdateCategoryMutation()

  if (isLoading) {
    return <Spin />
  }

  const {translations, in_menu} = data

  return <Modal
      open={open}
      onOk={()=>{
        form.validateFields()
            .then(values=>{
              form.resetFields()
              updateCategory({id,body: {...values,in_menu}})
              onOk()
            })

      }}
      onCancel={onCancel}
  >
    <Form
        name="translate_category_form"
        layout='vertical'
        form={form}

    >
      {
        translations.map(({locale,title,id})=>(<div key={id}>
          <p>{locale}</p>
          <h3>{title}</h3></div>))
      }
      <Divider />
      <Form.Item
          label="Title"
          name='title'
          rules={[
            {required:true,message: 'Title is required'}
          ]}
      ><Input /></Form.Item>
      <Form.Item
          name='lng'
          label="Select Language"
          rules={[
            {required: true}
          ]}
      >
        <Select
            // defaultValue={i18n.language}
            options={[
              {value: 'ro', label: 'Romana'},
              {value: 'en', label: 'English'},
              {value: 'ru', label: 'Russian'},
            ]}
        />
      </Form.Item>
    </Form>
  </Modal>
}
