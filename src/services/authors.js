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
      query: (page, locale) => `/authors?page=${page}&locale=${locale}`,
      providesTags: result => [
          ...result.data.map(({id})=>({type: "Authors", id})),
        {type: "Authors", id: "PARTIAL-LIST"}
      ]
    }),
    getAuthor: build.query({
      query: author => `/authors/${author}`,
      providesTags: result => [
        { type: 'Authors', id: result.id }
      ]
    }),
    addAuthor: build.mutation({
      query: body => ({
        url: '/authors',
        method: "POST",
        body
      }),
      invalidatesTags: result => [
        { type: "Authors", id: result.id },
        { type: "Authors", id: "PARTIAL-LIST" }
      ]
    }),
    updateAuthor: build.mutation({
      query: ({author,body}) =>({
        url: `/authors/${author}`,
        method: "PATCH",
        body
      }),
      invalidatesTags: result => [
        { type: "Authors", id: result.id },
        { type: "Authors", id: "PARTIAL-LIST" }
      ]
    }),
    deleteAuthor: build.mutation({
      query: author => ({
        url: `/authors/${author}`,
        method: "DELETE"
      }),
      invalidatesTags: (r,e,id)=>[
        { type: "Authors", id },
        { type: "Authors", id: "PARTIAL-LIST" }
      ]
    })
  })
})

export const {
  useGetAuthorsQuery,
  useGetAuthorQuery,
  useAddAuthorMutation,
  useUpdateAuthorMutation,
  useDeleteAuthorMutation
} = authors