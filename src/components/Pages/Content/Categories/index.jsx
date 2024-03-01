import React, {useEffect, useState} from 'react';
import {Button, Card, Pagination, Space, Switch, Table, Tag} from 'antd';
import {useDeleteCategoryMutation, useGetCategoriesQuery} from "../../../../services/categories"
import {useTranslation} from "react-i18next"
import {Link} from "react-router-dom"
import i18n from "../../../../i18n";
import {DeleteFilled, EditOutlined} from "@ant-design/icons";
import {EditCategory, NewCategory, TranslateCategory} from "./_forms";


export const Categories = () => {

  const [isNew, setIsNew] = useState(false)
  const [isEdit,setIsEdit] = useState(false)
  const [isTranslate,setIsTranslate] = useState(false)
  const [category,setCategory] = useState(null)
  const [page, setPage] = useState(1)

  const [deleteCategory] = useDeleteCategoryMutation()

  const {t} = useTranslation()


  const [locale, setLocale] = useState(i18n.language)

  i18n.on('languageChanged', lang => {
    setLocale(lang)
  })

  const columns = [
    {
      title: t('pages.content.categories.table.title'),
      dataIndex: 'title',
      key: 'title',
      render: (text, {key}) => {
        return <Link to={`/content/category/${key}`}>{text}</Link>
      }
    },
    {
      title: t('pages.content.categories.table.in_menu'),
      dataIndex: 'in_menu',
      key: 'in_menu',
      render: (text,{key, in_menu}) => (
          <Switch onChange={()=>{}} checked={in_menu} />
      )
    },
    {
      title: '',
      render: ({key}) => (<>
        <Button type="primary" danger className="table-buttons" icon={<DeleteFilled />} onClick={()=>{
          deleteCategory(key)
        }} />
        <Button
            type="info"
            className='table-buttons'
            onClick={() => {
              setIsTranslate(true)
              setCategory(key)
            }}>Translate</Button>
        <Button
            type="warning"
            className='table-buttons'
            icon={<EditOutlined />}
            onClick={() => {
              setIsEdit(true)
              setCategory(key)
              // return <EditCategoryForm id={category} visible={isEdit} onEdit={onEdit} />
            }} />
      </>)
    }
  ]

 const {data, isLoading, isSuccess} = useGetCategoriesQuery(page,locale)


  const categories = data?.data.map((({id,translations})=>({
    key: id,
    title: translations.find(({locale})=>locale===i18n.language) ? translations.find(({locale})=>locale===i18n.language).title : 'Notitle',
    in_menu: translations.find(({locale})=>locale===i18n.language) ? translations.find(({locale})=>locale===i18n.language).in_menu : false,
  })))

  return <Card
      loading={isLoading}
      title="Categories"
      extra={<Button type="success" onClick={()=>setIsNew(true)}>New</Button>}
  >
    <Table columns={columns} dataSource={categories} pagination={false} />
    <Pagination
        total={data?.total}
        defaultCurrent={data?.current_page}
        onChange={page=>setPage(page)}
    />
    <NewCategory
        open={isNew}
        onCancel={()=>setIsNew(false)}
        onOk={()=>{
          setIsNew(false)
        }}
    />
    {
      isEdit && <EditCategory
            id={category}
            open={isEdit}
            onOk={()=>{
              setCategory(null)
              setIsEdit(false)
            }}
            onCancel={()=>{
              setCategory(null)
              setIsEdit(false)
            }}
        />
    }
    {
      isTranslate && <TranslateCategory open={isTranslate} onOk={()=>{
        setCategory(null)
        setIsTranslate(false)
      }} onCancel={()=>{
          setCategory(null)
          setIsTranslate(false)
        }} id={category}/>
    }
  </Card>

};
