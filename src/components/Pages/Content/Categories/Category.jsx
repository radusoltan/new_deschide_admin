import {useAddArticleMutation, useGetCategoryArticlesQuery} from "../../../../services/articles";
import {Button, Card, Pagination, Table} from "antd";
import React, {useState} from "react";
import {Link, useParams} from "react-router-dom";
import i18n from "../../../../i18n";
import moment from 'moment'
import {NewArticle} from "../Articles/NewArticle";

export const Category = ()=>{

  const [newArticle, setNewArticle] = useState(false)
  const [locale, setLocale] = useState(i18n.language)

  const {category} = useParams()


  const [page, setPage] = useState(1)
  const {data, isLoading} = useGetCategoryArticlesQuery({page, category, locale})
  const [addArticle] = useAddArticleMutation()

  i18n.on('languageChanged', locale=>setLocale(locale))

  const columns = [
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      render: (text,{key}) => <Link to={`/content/article/${key}`}>{text}</Link>
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: text => <h3>{text}</h3>
    },
    {
      title: 'Created',
      dataIndex: 'created_at',
      key: 'created_at',
      render: text => <>{moment(text).fromNow()}</>
    }
  ]

  const pageChange = page => {
    setPage(page)
  }

  const articles = data?.data.map(({id,translations, created_at, status})=>{
    const translated = translations.find(({locale})=>locale===i18n.language)

    return translated ? {
      key: id,
      title: translated.title,
      status,
      created_at
    } : {
      key: id,
      status,
      title: 'No trans',
      created_at
    }
  })

  return <Card loading={isLoading} extra={<Button type="success" onClick={()=>setNewArticle(true)}>New</Button>}>
    <Table
        pagination={false}
        dataSource={articles}
        columns={columns}
    />

    <Pagination
      defaultCurrent={data?.current_page}
      total={data?.total}
      onChange={pageChange}
      pageSize={data?.per_page}
      hideOnSinglePage={true}
    />
  <NewArticle
      open={newArticle}
      onOk={values=> {
        console.log('onOk', values)
        addArticle({category,body:{...values}})
        // setNewArticle(false)
      }}
      onCancel={()=>setNewArticle(false)}
      category={category}
  />
  </Card>
}