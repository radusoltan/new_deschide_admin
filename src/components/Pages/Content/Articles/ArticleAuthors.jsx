import {Button, Card, List, Space, Spin} from "antd";
import {
  useAddArticleAuthorsMutation,
  useDeleteArticleAuthorMutation,
  useGetArticleAuthorsQuery
} from "../../../../services/authors";
import {DeleteOutlined, UnorderedListOutlined, UserAddOutlined} from "@ant-design/icons";
import {useState} from "react";
import {AddAuthor} from "../Authors/AddAuthor";
import i18n from "../../../../i18n";
import {SelectArticleAuthors} from "../Authors/SelectArticleAuthors";

export const ArticleAuthors = ({article})=>{
  const [isNew, setIsNew] = useState(false)
  const [isSelect, setIsSelect] = useState(false)
  const {data, isLoading} = useGetArticleAuthorsQuery(article, i18n.language)
  const [addAuthor] = useAddArticleAuthorsMutation()
  const [deleteAuthor] = useDeleteArticleAuthorMutation()

  if (isLoading) {
    return <Spin />
  }

  return <Card
    loading={isLoading}
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
      dataSource={data}
      renderItem={({translations}) => {
        const author = translations.find(({locale})=>i18n.language===locale)

        return (
          <List.Item actions={[
            <Button
              onClick={()=> {
                deleteAuthor({article, author: author.author_id})
              }}
              type="danger"
              icon={<DeleteOutlined />}
            />
          ]}>
            <List.Item.Meta
              title={author? author.full_name : "No trans"}
            />
          </List.Item>
        )
      }}
    />
    <AddAuthor
      open={isNew}
      onOk={values=> {
        console.log(values)
        const body = {
          ...values,
          locale: i18n.language
        }
        addAuthor({article, body})
        setIsNew(false)
      }}
      onCancel={()=> {
        setIsNew(false)
      }}
    />
    <SelectArticleAuthors
      open={isSelect}
      article={article}
      onOk={()=>{
        setIsSelect(false)
      }}
      onCancel={()=>{
        setIsSelect(false)
      }}
    />
  </Card>
}