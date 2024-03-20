import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react"
import i18n from "../i18n";

const baseUrl = process.env.REACT_APP_API_URL

export const users = createApi({
  reducerPath: 'users',
  baseQuery: fetchBaseQuery({
    baseUrl,
    prepareHeaders: (headers, {getState})=>{
      const token = getState().auth.userToken
      if (token){
        headers.set('authorization', `Bearer ${token}`)
      }
    }
  }),
  tagTypes: ["Users", "Roles", "Permissions"],
  endpoints: build => ({
    getUsers: build.query({
      query: (page)=> `/users?page=${page}`,
      providesTags: result => [
          ...result.data.map(({id})=>({type: "Users", id})),
        { type: "Users", id: "PARTIAL-LIST" }
      ]
    }),
    getUser: build.query({
      query: user => `/users/${user}`,
      providesTags: result => [
        {type: "Users",id: result.id},
        { type: "Users", id: "PARTIAL-LIST" }
      ]
    }),
    addUser: build.mutation({
      query: (body) => ({
        url: '/users',
        method: "POST",
        body
      }),
      invalidatesTags: response => [
        [{ type: "Users", id: response.id }],
        { type: "Users", id: "PARTIAL-LIST" }
      ]
    }),
    updateUser: build.mutation({
      query: ({user, body}) => ({
        url: `/users/${user}`,
        method: "PATCH",
        body
      }),
      invalidatesTags: response => [
        [{ type: "Users", id: response.id }],
        { type: "Users", id: "PARTIAL-LIST" }
      ]
    }),
    deleteUser: build.mutation({
      query: user => ({
        url: `/users/${user}`,
        method: "DELETE"
      }),
      invalidatesTags: (r,e,id) => [
        { type: "Users", id },
        { type: "Users", id: "PARTIAL-LIST" }
      ]
    }),

    getPermissions: build.query({
      query: ()=>'/permissions',
      providesTags: response => [
          ...response.map(permission=>({type: "Permissions", id:permission.id})),
        { type: "Permissions", id: "LIST" }
      ]
    }),
    getPermission: build.query({
      query: permission => `/permissions/${permission}`,
      providesTags: result => [{type: "Permissions", id: result.id}]
    }),
    updatePermission: build.mutation({
      query: ({permission, body}) => ({
        url: `/permissions/${permission}`,
        method: "PATCH",
        body
      }),
      invalidatesTags: result => [
        {type: "Permissions", id: result.id},
        { type: "Permissions", id: "LIST" }
      ]
    }),
    addPermission: build.mutation({
      query: body => ({
        url: '/permissions',
        method: "POST",
        body
      }),
      invalidatesTags: response => [
        {type: "Permissions", id: response.id},
        { type: "Permissions", id: "LIST" }
      ]
    }),
    deletePermission: build.mutation({
      query: permission => ({
        url: `/permissions/${permission}`,
        method: "DELETE"
      }),
      invalidatesTags: (r,e,id) => [
        {type: "Permissions", id},
        { type: "Permissions", id: "LIST" }
      ]
    }),

    getRoles: build.query({
      query: ()=> '/roles',
      providesTags: result => [
        ...result.map(({id})=>({ type: "Roles", id })),
        { type: "Users", id: "PARTIAL-LIST" },
        { type: "Roles", id: "LIST" }
      ]
    }),
    getRole: build.query({
      query: role => `/roles/${role}`
    }),
    addRole: build.mutation({
      query: body => ({
        url: `/roles`,
        method: "POST",
        body
      }),
      invalidatesTags: result => [
        {type: "Roles", id: result.id},
        {type: "Roles", id: "LIST"}
      ]
    }),
    deleteRole: build.mutation({
      query: role => ({
        url: `/roles/${role}`,
        method: "DELETE"
      }),
      invalidatesTags: (r,e,id) => [
        {type: "Roles", id},
        {type: "Roles", id: "LIST"}
      ]
    }),
    updateRole: build.mutation({
      query: ({role, body}) => ({
        url: `/roles/${role}`,
        method: "PATCH",
        body
      }),
      invalidatesTags: response => [
        {type: "Roles", id: response.id},
        {type: "Roles", id: "LIST"}
      ]
    })
  })

})

export const {
  useGetUsersQuery,
  useGetUserQuery,
  useAddUserMutation,
  useDeleteUserMutation,
  useUpdateUserMutation,

  useGetRolesQuery,
  useGetRoleQuery,
  useAddRoleMutation,
  useDeleteRoleMutation,
  useUpdateRoleMutation,


  useGetPermissionsQuery,
  useAddPermissionMutation,
  useDeletePermissionMutation,
  useUpdatePermissionMutation,
  useGetPermissionQuery
} = users