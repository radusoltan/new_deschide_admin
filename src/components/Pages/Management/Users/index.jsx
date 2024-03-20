import {Button, Card, Pagination, Space, Spin, Table} from "antd";
import {useDeleteUserMutation, useGetRolesQuery, useGetUsersQuery} from "../../../../services/users";
import {useState} from "react";
import {DeleteFilled, EditFilled, PlusSquareFilled} from "@ant-design/icons";
import {EditUser, NewUser} from "./_form";

export const Users = () => {

  const [page, setPage] = useState(1)
  const [isNew, setIsNew] = useState(false)
  const [isEdit, setIsEdit] = useState(false)
  const [selectedUser, setSelectedUser] = useState()
  const {data: usersData, isLoading: usersDataIsLoading} = useGetUsersQuery(page)
  const {data: rolesData, isLoading: rolesDataIsLoading} = useGetRolesQuery()
  const [deleteUser] = useDeleteUserMutation()

  const users = usersData?.data.map(user=>({
    key: user.id,
    name: user.name,
    // roles:
  }))

  const columns = [
    {
      title: "Name",
      dataIndex: 'name',
      key: 'name',
      render: (text)=><>{text}</>
    },
    {
      render: ({key})=><Space>
        <Button
          icon={<EditFilled />}
          type="warning"
          onClick={()=> {
            setIsEdit(true)
            setSelectedUser(key)
          }}
        />
        <Button
          danger
          icon={<DeleteFilled />}
          type="primary"
          onClick={()=>{
            deleteUser(key)
          }}
        />
      </Space>
    }
  ]

  if (usersDataIsLoading && rolesDataIsLoading) return <Spin />
  return <Card
      title="Users"
      extra={<Button type="success" icon={<PlusSquareFilled />} onClick={()=>setIsNew(true)} />}
  >
    <Table columns={columns} dataSource={users} pagination={false} />
    <Pagination
      total={usersData?.total}
      defaultCurrent={usersData?.current_page}
      onChange={page=>setPage(page)}
    />
    <NewUser
      open={isNew}
      roles={rolesData}
      onOk={()=>setIsNew(false)}
      onCancel={()=>setIsNew(false)}
    />
    {isEdit &&
        <EditUser
            open={isEdit}
            user={selectedUser}
            onOk={()=>{
              setIsEdit(false)
              setSelectedUser(null)
            }}
            onCancel={()=>{
              setIsEdit(false)
              setSelectedUser(null)
            }}
            rolesData={rolesData}
        />
    }
  </Card>
}