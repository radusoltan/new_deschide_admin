import {Button, Card, Space, Spin, Table} from "antd";
import {DeleteFilled, EditFilled, PlusSquareFilled} from "@ant-design/icons";
import {useDeleteRoleMutation, useGetPermissionsQuery, useGetRolesQuery} from "../../../../services/users";
import {useState} from "react";
import {EditRole, NewRole} from "./_form";

export const Roles = () => {

  const {data, isLoading} = useGetRolesQuery()
  const {data: permissions, isLoading: permissionsLoading} = useGetPermissionsQuery()
  const [isNew, setIsNew] = useState(false)
  const [isEdit, setIsEdit] = useState(false)
  const [selectedRole, setSelectedRole] = useState()
  const [deleteRole] = useDeleteRoleMutation()

  if (isLoading && permissionsLoading) return <Spin />

  const roles = data?.map(role=>({
    key: role.id,
    name: role.name,
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
        <Button type="warning" icon={<EditFilled />} onClick={()=> {
          setIsEdit(true)
          setSelectedRole(key)
        }} />
        <Button danger icon={<DeleteFilled />} type="primary" onClick={()=>{
          deleteRole(key)
        }}/>
      </Space>
    }
  ]

  return <Card
    title="Roles"
    extra={<Button icon={<PlusSquareFilled />} type="success" onClick={()=>setIsNew(true)}/>}
  >
    <Table dataSource={roles} columns={columns} />
    <NewRole
      open={isNew}
      onOk={()=>setIsNew(false)}
      onCancel={()=>setIsNew(false)}
      permissions={permissions}
    />
    {isEdit &&
      <EditRole
        open={isEdit}
        onOk={()=>{
          setIsEdit(false)
          setSelectedRole(null)
        }}
        onCancel={()=>{
          setIsEdit(false)
          setSelectedRole(null)
        }}
        permissions={permissions}
        role={selectedRole}
      />
    }
  </Card>
}