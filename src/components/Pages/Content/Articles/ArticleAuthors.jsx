import {Card, Spin} from "antd";
import {useGetArticleAuthorsQuery} from "../../../../services/authors";

export const ArticleAuthors = ({article})=>{

  const {data, isLoading} = useGetArticleAuthorsQuery(article)

  if (isLoading) {
    return <Spin />
  }

  console.log(data)

  return <Card>

  </Card>
}