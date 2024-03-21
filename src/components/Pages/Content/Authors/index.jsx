import React, {useState} from "react";
import i18n from "../../../../i18n";
import {Button, Card, Pagination, Space, Spin, Table} from "antd";
import {useLocation, useParams} from "react-router-dom";
import {useDeleteAuthorMutation, useGetAuthorsQuery} from "../../../../services/authors";
import {DeleteFilled, EditFilled} from "@ant-design/icons";
import {EditAuthor, NewAuthor, TranslateAuthor} from "./_forms";

export const Authors = () => {

  const {pathname} = useLocation()

  const [page, setPage] = useState(1)
  const [locale, setLocale] = useState(i18n.language)
  const [author, setAuthor] = useState(null)

  const [isNew, setIsNew] = useState(false)
  const [isEdit, setIsEdit] = useState(false)

  const {data, isLoading} = useGetAuthorsQuery(page)
  const [deleteAuthor] = useDeleteAuthorMutation()

  i18n.on('languageChanged',(locale)=>{
    setLocale(locale)
  })

  const authors = data?.data.map(author=>({
    key: author.id,
    name: author.translations.find((translation)=>translation.locale===locale) ?
        author.translations.find((translation)=>translation.locale===locale).full_name :
        "No trans"
  }))

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (text) => text
    },
    {
      render: ({key})=>(<Space>
        <Button
          type="warning"
          icon={<EditFilled />}
          onClick={()=>{
            setAuthor(key)
            setIsEdit(true)
          }}
        />
        <Button
          danger
          type="primary"
          icon={<DeleteFilled />}
          onClick={()=>{
            deleteAuthor(key)
          }}
        />
      </Space>)
    }
  ]

  return <Card extra={
    <Button
        type="success"
        onClick={()=>setIsNew(true)}
    >New
    </Button>
  }>
    <h1>Authors</h1>
    <Table dataSource={authors} columns={columns} pagination={false} />
    <Pagination
      total={data?.total}
      defaultCurrent={data?.current_page}
      onChange={page=>setPage(page)}
    />
    <NewAuthor
      open={isNew}
      onOk={()=>setIsNew(false)}
      onCancel={()=>setIsNew(false)}
    />
    {isEdit &&
      <EditAuthor
        open={isEdit}
        author={author}
        onOk={()=>{
          setAuthor(null)
          setIsEdit(false)
        }}
        onCancel={()=>{
          setAuthor(null)
          setIsEdit(false)
        }}
      />
    }
  </Card>
}