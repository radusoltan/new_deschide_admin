import {MailOutlined} from "@ant-design/icons";

export const filterPermissions = permissions => permissions.map(({name})=> name)

export const getUserMenu = permissions => {

  return [
      getItem('Dashboard','/'),
      getItem('Content','/content', <MailOutlined />,[
          permissions.includes('category-list') && getItem('Categories','/content/categories'),
          permissions.includes('article-list') && getItem('Articles','/content/articles'),
          permissions.includes('author-list') && getItem('Authors','/content/authors')
      ]),
      getItem('Management','/management',<MailOutlined />, [
          permissions.includes('user-list') && getItem('Users','/management/users'),
          permissions.includes('role-list') && getItem('Roles','/management/roles'),
          permissions.includes('permission-list') && getItem('Permissions','/management/permissions'),
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