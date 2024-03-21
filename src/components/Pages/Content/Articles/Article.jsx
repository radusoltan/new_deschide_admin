import {Button, Card, Space, Input, Row, Col, Divider, Select, Switch, Spin} from "antd";
import {useGetArticleQuery, useUpdateArticleMutation} from "../../../../services/articles";
import {useNavigate, useParams} from "react-router-dom";
import {CloseCircleFilled, SaveFilled} from "@ant-design/icons";
import {useEffect, useState} from "react";
import i18n from "../../../../i18n";
import {ArticleAuthors} from "./ArticleAuthors";
import {BodyEditor} from "./Editor";
import {ArticleImages} from "../Images/ArticleImages";
import {SubmitEvents} from "./SubmitEvents";

export const Article = ()=>{

  const navigate = useNavigate()

  const {article} = useParams()
  const [articleData, setArticleData] = useState({})

  const {data, isLoading, isSuccess} = useGetArticleQuery(article)
  const [updateArticle] = useUpdateArticleMutation()

  const handleFlashChange = (checked) => {
    setArticleData(prevData => ({
      ...prevData,
      is_flash: checked,
      is_breaking: false,
      is_alert: false
    }));
  };

  const handleAlertChange = (checked) => {
    setArticleData(prevData => ({
      ...prevData,
      is_alert: checked,
      is_breaking: false,
      is_flash: false
    }));
  };

  const handleBreakingChange = (checked) => {
    setArticleData(prevData => ({
      ...prevData,
      is_breaking: checked,
      is_flash: false,
      is_alert: false
    }));
  }

  const save = () => {
    updateArticle({article,body:{
      ...articleData,
      lng: i18n.language
    }})
  }

  const saveAndClose = ()=>{

    save()

    setTimeout(()=>navigate(`/content/category/${articleData.category_id}`), 2000)

  }

  const close = ()=> navigate(`/content/category/${articleData.category_id}`)



  useEffect(() => {
    if (isSuccess) {
      const { translations, is_alert, is_breaking, is_flash, category_id, visits, authors } = data;
      const translation = translations.find(({ locale }) => locale === i18n.language) || {};

      const {
        title = 'No translation',
        lead = 'No lead Translation',
        body = 'No body translation',
        status = 'N',
        id: translationId,
        publish_at
      } = translation;

      const updatedArticleData = {
        title,
        lead,
        body,
        is_flash,
        is_breaking,
        is_alert,
        status,
        category_id,
        publish_at,
        translationId,
        visits,
        authors
      };

      setArticleData(updatedArticleData);
    }
  }, [isSuccess])

  if (isLoading) return <Spin />

  return <Card
    loading={isLoading}
    title={'Visits: '+ articleData?.visits?.score}
    extra={<Space direction="horizontal">
      <Button onClick={save} type="success" icon={<SaveFilled />}>Save</Button>
      <Button onClick={saveAndClose} type="info">Save & Close</Button>
      <Button onClick={close} type="primary" danger icon={<CloseCircleFilled />}>Close</Button>
    </Space>}
  >
    <Input
      onChange={e=>{
        const newTitle = e.target.value;
        setArticleData(prevData => ({
          ...prevData,
          title: newTitle
        }));

      }}
      value={articleData.title}
      size="large"
      maxLength={200}
      showCount={true}
    />
    <ArticleAuthors article={article} authors={articleData.authors} />
    <Row>
      <Col span={18}>
        <Card>
          <BodyEditor field="lead" initialValue={articleData.lead} onEdit={lead=>{
            setArticleData(prevstate=>({
              ...prevstate,
              lead
            }))
          }} />
          <Divider />
          <BodyEditor initialValue={articleData.body} onEdit={body=>{
            setArticleData(prevState => ({
              ...prevState,
              body
            }))
          }} />
        </Card>
      </Col>
      <Col span={6}>
        <Card>
          <Select
            onChange={status=>{
              setArticleData(prevstate=>({
                ...prevstate,
                status
              }))
            }}
            value={articleData.status}
          >
            <Select.Option value='N'>New</Select.Option>
            <Select.Option value='S'>Submitted</Select.Option>
            <Select.Option value='P'>Published</Select.Option>
          </Select>
          {
            articleData.status === 'S' && <SubmitEvents article={article} publish_at={articleData.publish_at} translationId={articleData.translationId} />
          }
          <Divider />
          <Card>
            <Space direction="vertical">
              <p>FLASH</p>
              <Switch
                onChange={handleFlashChange}
                checked={articleData.is_flash}
              />
              <p>ALERT</p>
              <Switch
                onChange={handleAlertChange}
                checked={articleData.is_alert}
              />
              <p>BREAKING</p>
              <Switch
                onChange={handleBreakingChange}
                checked={articleData.is_breaking}
              />
            </Space>
          </Card>
          <Divider/>
          <ArticleImages article={article}/>
        </Card>
      </Col>
    </Row>
  </Card>
}