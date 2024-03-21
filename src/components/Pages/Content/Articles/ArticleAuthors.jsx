import {Button, Card, List, Space, Spin} from "antd";

import {DeleteFilled, DeleteOutlined, UnorderedListOutlined, UserAddOutlined} from "@ant-design/icons";
import {useState} from "react";

import i18n from "../../../../i18n";
import {SelectArticleAuthors} from "../Authors/SelectArticleAuthors";
import {NewAuthor} from "../Authors/_forms";
import {articles, useDeleteArticleAuthorMutation, useGetArticleAuthorsQuery} from "../../../../services/articles";


export const ArticleAuthors = ({article})=>{
  const [isNew, setIsNew] = useState(false)
  const [isSelect, setIsSelect] = useState(false)

  const {data, isLoading} = useGetArticleAuthorsQuery(article)
  const [deleteArticleAuthor] = useDeleteArticleAuthorMutation()


  return <Card

    title={"Authors"}
    extra={<Space>
      <Button
        onClick={()=>setIsNew(true)}
        type="success"
        icon={<UserAddOutlined />}
      />
      <Button
        onClick={()=>setIsSelect(true)}
        type="primary"
        icon={<UnorderedListOutlined />}
      />
    </Space>}
  >
    <List
      loading={isLoading}
      dataSource={data}
      renderItem={author=>{
        return (
          <List.Item key={author.id} actions={[
            <Button
              danger
              type="primary"
              icon={<DeleteFilled />}
              onClick={()=>deleteArticleAuthor({article, author: author.id})}
            />
          ]}>
            <List.Item.Meta title={author.full_name} />
          </List.Item>
        )
      }}
    />

    <SelectArticleAuthors
      open={isSelect} onOk={()=>{
        setIsSelect(false)
      }}
      onCancel={()=>{
        setIsSelect(false)
      }}
      article={article}
    />
    <NewAuthor
      open={isNew}
      onOk={()=>setIsNew(false)}
      article={article}
      onCancel={()=>setIsNew(false)}
    />
  </Card>
}