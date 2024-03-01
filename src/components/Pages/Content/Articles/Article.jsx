import {useGetArticleQuery, useUpdateArticleMutation} from "../../../../services/articles";
import {Button, Card, Col, Divider, Input, Row, Select, Space, Switch, notification} from "antd";
import {StopFilled} from "@ant-design/icons";
import {ArticleImages} from "../Images/ArticleImages";
import {BodyEditor} from "./Editor";
import {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import i18n from "../../../../i18n";
import {ArticleAuthors} from "./ArticleAuthors";

export const Article = ()=>{

  const {article} = useParams()
  const navigate = useNavigate()

  const {data, isLoading, isSuccess} = useGetArticleQuery(article)

  const [selectedSwitch, setSelectedSwitch] = useState('')

  const [updateArticle,{data: updateArticleData,isLoading: updateArticleDataIsLoading, isSuccess: updateArticleIsSuccess}] = useUpdateArticleMutation()

  const [loading,setLoading] = useState(false)
  const [articleTitle, setArticleTitle] = useState('')
  const [articleLead, setArticleLead] = useState('')
  const [articleBody, setArticleBody] = useState('')
  const [articleIsAlert, setArticleIsAlert] = useState(false)
  const [articleIsFlash, setArticleIsFlash] = useState(false)
  const [articleIsBreaking, setArticleIsBreaking] = useState(false)
  const [articleStatus, setArticleStatus] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [eventPublish, setEventPublish] = useState('')
  const [translationId, setTranslationId] = useState('')
  const [articleImages, setArticleImages] = useState([]);
  const [articleAuthors, setArticleAuthors] = useState([])
  const body = {
    title: articleTitle,
    lead: articleLead,
    body: articleBody,
    is_flash: articleIsFlash,
    is_breaking: articleIsBreaking,
    is_alert: articleIsAlert,
    status: articleStatus,
    categoryId: categoryId,
    lng: i18n.language
  }

  useEffect(()=>{
    if (
        isLoading||updateArticleDataIsLoading
    ) {
      setLoading(true)
    }
    if (isSuccess){

      console.log('Article', data)

      setLoading(false)
      const {id, category_id, translations, is_alert, is_breaking, is_flash, visits, images, authors } = data
      const {title, lead, body, status, publish_at, id: translationId} = translations.find(({locale}) => i18n.language === locale) ?
          translations.find(({locale}) => i18n.language === locale) :
          {
            title: 'No translation',
            lead: 'No lead Translation',
            body: 'No body translation',
            status: 'N',
          }

      setArticleTitle(title)
      setArticleLead(lead)
      setArticleBody(body)
      setArticleIsFlash(is_flash)
      setArticleIsBreaking(is_breaking)
      setArticleIsAlert(is_alert)
      setArticleStatus(status)
      setCategoryId(category_id)
      setEventPublish(publish_at)
      setTranslationId(translationId)
      // setArticleVisits(visits)
      setArticleImages(images)
      setArticleAuthors(authors)

    }

    if (updateArticleIsSuccess){
      setLoading(false)
      const {id, category_id, translations, is_alert, is_breaking, is_flash, visits, images, authors } = updateArticleData
      const {title, lead, body, status, publish_at, id: translationId} = translations.find(({locale}) => i18n.language === locale)
      setArticleTitle(title)
      setArticleLead(lead)
      setArticleBody(body)
      setArticleIsFlash(is_flash)
      setArticleIsBreaking(is_breaking)
      setArticleIsAlert(is_alert)
      setArticleStatus(status)
      setCategoryId(category_id)
      setEventPublish(publish_at)
      setTranslationId(translationId)
      setArticleImages(images)
      setArticleAuthors(authors)
      // setArticleVisits(visits)
      notification.success({
        message: 'Articol salvat',
        duration: 2
      })
    }
    // if(deletedSuccess){
    //   setLoading(false)
    //   const {id, category_id, translations, is_alert, is_breaking, is_flash, visits, images } = deletedData
    //   const {title, lead, body, status, publish_at, id: translationId} = translations.find(({locale}) => i18n.language === locale)
    //   setArticleTitle(title)
    //   setArticleLead(lead)
    //   setArticleBody(body)
    //   setArticleIsFlash(is_flash)
    //   setArticleIsBreaking(is_breaking)
    //   setArticleIsAlert(is_alert)
    //   setArticleStatus(status)
    //   setCategoryId(category_id)
    //   setEventPublish(publish_at)
    //   setTranslationId(translationId)
    //   setArticleImages(images)
    //   // setArticleVisits(visits)
    //
    // }

  },[
    isSuccess,
    isLoading,
    updateArticleDataIsLoading,
    updateArticleIsSuccess,
    // deletedSuccess
  ])

  const handleTitleChange = title => {
    setArticleTitle(title.target.value)
  }

  const handleSwitchChange = switchName => {


    setSelectedSwitch(switchName === selectedSwitch ? null : switchName)
  }

  const handleStatusChange = status=>{
    setArticleStatus(status)
  }
  const save = ()=>{

    updateArticle({article, body})
  }
  const saveAndClose = ()=>{
    setTimeout(()=>navigate(`/content/category/${categoryId}`),2000)
  }
  const close = ()=>navigate(`/content/category/${categoryId}`)

  return <Card
      loading={isLoading}
      title={`Visits: ${data?.visits.score}`}
      extra={<Space direction="horizontal">
        <Button onClick={save} type="success">Save</Button>
        <Button onClick={saveAndClose} type="info">Save & Close</Button>
        <Button onClick={close} type="primary" danger icon={<StopFilled />}>Close</Button>
      </Space>}
  >
    <Input onChange={handleTitleChange} value={articleTitle} size="large" maxLength={200} showCount={true} />
    <ArticleAuthors article={article} />
    <Row>
      <Col span={18}>
        <Card>
          <BodyEditor initialValue={articleLead} field='lead' onEdit={lead=>{
            setArticleLead(lead)
          }} />
          <Divider />
          <BodyEditor initialValue={articleBody} field="body" onEdit={body=>{
            setArticleBody(body)

          }} />
        </Card>
      </Col>
      <Col span={6}>
        <Card>
          <Select onChange={handleStatusChange} value={articleStatus}>
            <Select.Option value='N'>New</Select.Option>
            <Select.Option value='S'>Submitted</Select.Option>
            <Select.Option value='P'>Published</Select.Option>
          </Select>
          <Divider />
          <Card>
            <Space direction="vertical">
              <p>FLASH</p>
              <Switch onChange={()=> {
                setArticleIsFlash(!articleIsFlash)
                handleSwitchChange('is_flash')
              }} checked={selectedSwitch==='is_flash'} />
              <p>ALERT</p>
              <Switch onChange={()=> {
                handleSwitchChange('is_alert')
                setArticleIsFlash(!articleIsAlert)
              }} checked={selectedSwitch==='is_alert'} />
              <p>BREAKING</p>
              <Switch onChange={()=> {
                setArticleIsBreaking(!articleIsBreaking)
                handleSwitchChange('is_breaking')
              }} checked={selectedSwitch==='is_breaking'} />
            </Space>
          </Card>
          <Divider />
          <ArticleImages article={article} />
        </Card>
      </Col>
    </Row>
  </Card>
}