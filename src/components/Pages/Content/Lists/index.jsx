import {Button, Card, Col, Form, Input, InputNumber, List, Modal, Pagination, Row, Select, Space} from "antd";

import {useState} from "react";
import {PlusSquareFilled} from "@ant-design/icons";
import {useGetArticlesQuery} from "../../../../services/articles";
import {
  useAddArticlesListMutation,
  useAddArticleToListMutation,
  useGetListsQuery
} from "../../../../services/articlesList";
import {SelectedList} from "../Articles/SelectedList";

export const Lists = ()=>{
  const [form] = Form.useForm()

  const [page, setPage] = useState(1)
  const [open, setOpen] = useState(false)
  const [selectedList, setSelectedList] = useState()

  const {data: articles} = useGetArticlesQuery(page)
  const {data: lists} = useGetListsQuery()
  const [addArticlesList] = useAddArticlesListMutation()
  const [addArticleToList] = useAddArticleToListMutation()


  return <Card
    title="Featured Articles List"
    extra={<Space>
      <Button
        icon={<PlusSquareFilled />}
        onClick={()=>{setOpen(true)}}
        type="success"
      >
        Add List
      </Button>
      |
      <Select
        style={{ width: 120 }}
        options={lists?.map(list=>({
          value: list.id,
          label: list.name
        }))}
        defaultValue="Select list"
        onChange={(list)=>{
          setSelectedList(list)
        }}
      />
  </Space>
    }
  >

      <Row>
        <Col span={12}>
          <Card>
            <Input />
            <List dataSource={articles?.data} renderItem={article=>(
              <List.Item actions={[
                <Button
                  icon={<PlusSquareFilled />}
                  type="success"
                  onClick={()=>{
                    addArticleToList({list: selectedList, body: {article:article.id}})
                  }}
                />
              ]}>
                <List.Item.Meta title={article.title} />
              </List.Item>
            )}/>
          </Card>
          <Pagination
            defaultCurrent={articles?.current_page}
            total={articles?.total}
            onChange={page=>setPage(page)}
            showSizeChanger={false}
          />
        </Col>
        <Col span={12}>
          <Card>
            {selectedList &&
                <SelectedList
                    list={selectedList}
                    onOk={()=>{
                      setSelectedList(null)

                    }}
                />
            }
          </Card>
        </Col>
      </Row>
    <Modal
      open={open}
      onOk={()=>{
        form.validateFields()
          .then(values=>{
            addArticlesList(values)
          })

      }}
      onCancel={()=>{

      }}
    >
      <Card>
        <Form
          name="new_list_form"
          layout="vertical"
          form={form}
        >
          <Form.Item
              name="name"
              label="List name"
              rules={[
                { required: true }
              ]}
          ><Input /></Form.Item>
          <Form.Item
              name="max_item_count"
              label="List limit"
              rules={[
                { required: true }
              ]}
          ><InputNumber /></Form.Item>
        </Form>
      </Card>
    </Modal>
  </Card>
}