import {MailOutlined} from "@ant-design/icons";



export const getUserMenu = permissions => {

  const names = permissions.map(({name})=>(name))

  return [
      getItem('Dashboard','/'),
      getItem('Content','/content', <MailOutlined />,[
          names.includes('category-list') && getItem('Categories','/content/categories'),
          names.includes('article-list') && getItem('Articles','/content/articles'),
          names.includes('author-list') && getItem('Authors','/content/authors')
      ]),
      getItem('Management','/management',<MailOutlined />, [
          names.includes('user-list') && getItem('Users','/management/users'),
          names.includes('role-list') && getItem('Roles','/management/roles'),
          names.includes('permission-list') && getItem('Permissions','/management/permissions'),
      ])
  ]



}

const getItem = (label, key, icon, children, type) => {
  return {
    key,
    icon,
    children,
    label,
    type,
  }
}