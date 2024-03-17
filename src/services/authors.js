import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react"

const baseUrl = process.env.REACT_APP_API_URL

export const authors = createApi({
  reducerPath: 'authors',
  baseQuery: fetchBaseQuery({
    baseUrl,
    prepareHeaders: (headers,{getState})=> {
      const token = getState().auth.userToken
      if (token){
        headers.set('authorization', `Bearer ${token}`)
      }
    }
  }),
  tagTypes: ['Authors'],
  endpoints: build => ({
    getAuthors: build.query({
      query: (page)=> `authors?page=${page}`,
      providesTags: response => response ? [
          ...response.data.map(({id})=>({type:"Authors", id})),
        {type: "Authors", id: "PARTIAL-LIST"}
      ] : [{type: "Authors", id: "PARTIAL-LIST"}]
    }),
    getAllAuthors: build.query({
      query: ()=> `all-authors`,
      providesTags: response => [
        ...response.map(({id})=>({type:"Articles", id})),
        {type: "Authors", id: "LIST"}
      ]
    }),
    getAuthor: build.query({
      query: (author) => `/authors/${author}`,
      providesTags: response => [
          [{ type: "Authors", id: response.id }],
        {type: "Authors", id: "LIST"}
      ]
    }),
    getArticleAuthors: build.query({
      query: (article) => `/article/${article}/authors`,
      providesTags: result => [
          ...result.map(({id})=>({ type: "Authors",id })),
        {type:"Authors", id: "LIST"}
      ]
    }),
    addAuthor: build.mutation({
      query: body => ({
        url: '/authors',
        method: "POST",
        body
      }),
      invalidatesTags: response => [
        [{ type: "Authors", id: response.id }],
        { type: "Authors", id: "LIST" }
      ]
    }),
    updateAuthor: build.mutation({
      query: ({author, body}) => ({
        url: `/authors/${author}`,
        method: "PATCH",
        body
      }),
      invalidatesTags: response => [
        [{ type: "Authors", id: response.id }],
        { type: "Authors", id: "LIST" }
      ]
    }),
    addArticleAuthors: build.mutation({
      query: ({article, body}) => ({
        url: `/article/${article}/authors`,
        method: "POST",
        body
      }),
      invalidatesTags: response => [{ type: "Authors", id: response.id }]
    }),
    deleteArticleAuthor: build.mutation({
      query: ({article, author}) => ({
        url: `/article/${article}/authors/${author}`,
        method: "DELETE"
      }),
      invalidatesTags: result => [
        ...result.map(({id})=>({ type: "Authors",  id})),
        {type: "Authors", id: "LIST"}
      ]
    })
  })
})

export const {
  useGetArticleAuthorsQuery,
  useAddAuthorMutation,
  useGetAuthorsQuery,
  useGetAuthorQuery,
  useUpdateAuthorMutation,
  useAddArticleAuthorsMutation,
  useGetAllAuthorsQuery,
  useDeleteArticleAuthorMutation
} = authors