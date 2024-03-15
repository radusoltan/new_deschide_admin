import {useState} from "react";
import i18n from "../../../../i18n";
import {Button, Card, Spin, Table} from "antd";
import {useGetAllAuthorsQuery} from "../../../../services/authors";
import {DeleteFilled, EditFilled} from "@ant-design/icons";
import {EditAuthor, NewAuthor, TranslateAuthor} from "./_forms";

export const Authors = () => {
  const [locale, setLocale] = useState(i18n.language)
  const [author, setAuthor] = useState(null)

  const [isNew, setIsNew] = useState(false)
  const [isEdit, setIsEdit] = useState(false)
  const [isTranslate, setIsTranslate] = useState(false)

  const {data, isLoading} = useGetAllAuthorsQuery()

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: text => (<>{text}</>)
    },
    {
      title: '',
      render: ({key}) => (<>
        <Button type="primary" danger className="table-buttons" icon={<DeleteFilled />} onClick={()=>{}} />
        <Button type="info" className="table-buttons" onClick={()=>{
          setIsTranslate(true)
          setAuthor(key)
        }}>Translate</Button>
        <Button type="warning" onClick={()=>{
          setIsEdit(true)
          setAuthor(key)
        }} className="table-buttons" icon={<EditFilled />} />
      </>)
    }
  ]

  const authors = data?.map(author=>({
    key: author.id,
    name: author.translations.find(translation=>translation.locale===locale) ? author.translations.find(translation=>translation.locale===locale).full_name : 'No translations'
  }))

  if (isLoading) return <Spin />

  return <Card extra={<Button type="success" onClick={()=>setIsNew(true)}>New</Button>}>
    <h1>Authors</h1>
    <Table columns={columns} dataSource={authors} />

    <NewAuthor open={isNew} onOk={()=>setIsNew(false)} onCancel={()=>setIsNew(false)} />
    {isEdit &&
      <EditAuthor
        open={isEdit}
        author={author}
        onOk={() => {
          setIsEdit(false)
          setAuthor(null)
        }}
        onCancel={() => {
          setIsEdit(false)
          setAuthor(null)
      }}/>
    }
    {isTranslate &&
      <TranslateAuthor
        open={isTranslate}
        author={author}
        onOk={()=>{
          setAuthor(null)
          setIsTranslate(false)
        }}
        onCancel={()=>{
          setAuthor(null)
          setIsTranslate(false)
        }}
      />
    }

  </Card>
}