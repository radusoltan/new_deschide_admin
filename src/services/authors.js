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
    getAllAuthors: build.query({
      query: ()=> 'authors',
      providesTags: response => [
          ...response.map(({id})=>({type: "Authors", id})),
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
    })
  })
})

export const {
  useGetArticleAuthorsQuery,
  useAddAuthorMutation,
  useGetAllAuthorsQuery,
  useGetAuthorQuery,
  useUpdateAuthorMutation
} = authors