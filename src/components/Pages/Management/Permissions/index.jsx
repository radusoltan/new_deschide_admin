import {Button, Card, Space, Spin, Table} from "antd";
import {DeleteFilled, EditFilled, PlusSquareFilled} from "@ant-design/icons";
import {useDeletePermissionMutation, useGetPermissionsQuery} from "../../../../services/users";
import {useState} from "react";
import {EditPermission, NewPermission} from "./_form";

export const Permissions = () => {

  const {data, isLoading} = useGetPermissionsQuery()
  const [isNew, setIsNew] = useState(false)
  const [isEdit, setIsEdit] = useState(false)
  const [deletePermission] = useDeletePermissionMutation()
  const [selectedPermission, setSelectedPermission] = useState()
  if (isLoading) return <Spin />

  const permissions = data?.map(permission=>({
    key: permission.id,
    name: permission.name
  }))

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: text=>text
    },
    {
      render: ({key})=><Space>
        <Button type="warning" icon={<EditFilled />} onClick={()=>{
          setIsEdit(true)
          setSelectedPermission(key)
        }} />
        <Button danger type="primary" icon={<DeleteFilled />} onClick={()=>deletePermission(key)} />
      </Space>
    }
  ]

  return <Card
    title="Permissions"
    extra={<Button type="success" icon={<PlusSquareFilled />} onClick={()=>setIsNew(true)} />}
  >
    <Table dataSource={permissions} columns={columns} />
    <NewPermission open={isNew} onCancel={()=>setIsNew(false)} onOk={()=>setIsNew(false)}/>
    {isEdit &&
      <EditPermission
        open={isEdit}
        permission={selectedPermission}
        onOk={()=>{
          setIsEdit(false)
          setSelectedPermission(null)
        }}
        onCancel={()=>{
          setIsEdit(false)
          setSelectedPermission(null)
        }}
      />
    }
  </Card>
}