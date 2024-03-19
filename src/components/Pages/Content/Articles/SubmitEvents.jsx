import {Button, Card, DatePicker, Space} from "antd";
import moment from "moment";
import i18n from "../../../../i18n";
import {
  useDeleteArticlePublishTimeMutation,
  useSetArticlePublishTimeMutation
} from "../../../../services/articles";
import {DeleteFilled} from "@ant-design/icons";

export const SubmitEvents = ({article, publish_at, translationId})=>{

  moment.locale(i18n.language)

  const date = moment(publish_at)

  const [setArticlePublishTime] = useSetArticlePublishTimeMutation()
  const [deletePublishEvent] = useDeleteArticlePublishTimeMutation()

  return <Card title="Select publish time" style={{
    marginTop: 25
  }}>
    {publish_at && <Space direction="vertical">
      <div style={{marginBottom: 20}}>
        <div style={{padding: 5, border: '1px solid #e9e9e9'}}>
          {date.format('MMM DD YYYY kk:mm')}
          <Button icon={<DeleteFilled />} style={{
            marginLeft: 50
          }} onClick={()=>{
            deletePublishEvent(translationId)
          }} />
        </div>
      </div>
    </Space>}
    <Space direction="vertical">
      <DatePicker
        showTime
        onChange={()=>{}}
        onOk={(props)=>{
          setArticlePublishTime({
            id: article,
            body: {
              locale: i18n.language,
              time: props.format()
            }
          })
        }}
      />
    </Space>
  </Card>
}