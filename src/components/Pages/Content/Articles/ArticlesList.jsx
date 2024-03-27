import {Button, Card, List, Modal, Row, Select, Space} from "antd";
import {CloseCircleFilled, EditFilled, PlusCircleFilled, SaveFilled} from "@ant-design/icons";
import {useState} from "react";
import {
  useAddArticleToListMutation,
  useGetArticleListsQuery,
  useGetListsQuery
} from "../../../../services/articlesList";
import {SelectedList} from "./SelectedList";
import {useParams} from "react-router-dom";

export const ArticlesList = ()=>{

  const {article} = useParams()

  const [open, setOpen] = useState(false)
  const [selectedList, setSelectedList] = useState()
  const {data, isLoading} = useGetListsQuery()
  const [addArticleToList] = useAddArticleToListMutation()
  const {data: articleLists} = useGetArticleListsQuery(article)




  return <Card
    title="Featured Article Lists"
  >

    <List
        dataSource={articleLists}
        renderItem={list=>(<List.Item>
          <List.Item.Meta title={list.name} />
        </List.Item>)}
    />

    <Button
        icon={<EditFilled/>}
        onClick={()=>setOpen(true)}
    >Edit</Button>
    <Modal
      open={open}
      onOk={()=>{
        setOpen(false)
        setSelectedList(null)
      }}
      onCancel={()=> {
        setOpen(false)
        setSelectedList(null)
      }}
      width='70%'
    ><Card>
      <Row>
        <Space>
          <Select
              options={data?.map(list=>({
                value: list.id,
                label: list.name
              }))}
              defaultValue="Select a list"
              style={{ width: 120, float: 'left' }}
              onChange={list=>{
                setSelectedList(list)
              }}
          />

          <Button type="success"
            icon={<PlusCircleFilled />}
            onClick={()=>{
              addArticleToList({list: selectedList, body: {article}})
            }}
          >
            Add
          </Button>
          <Button
              type="primary"
              danger
              icon={<CloseCircleFilled />}
              onClick={()=> {
                setOpen(false)
                setSelectedList(null)
              }}
          >
            Close
          </Button>
        </Space>
      </Row>
      {selectedList &&
          <SelectedList
              list={selectedList}
              onOk={()=>{
                setSelectedList(null)

              }}
          />
      }

    </Card></Modal>
  </Card>
}