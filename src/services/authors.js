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
    addAuthor: build.mutation({

    }),
    getArticleAuthors: build.query({
      query: (article) => `/article/${article}/authors`,
      providesTags: result => [
          ...result.map(({id})=>({ type: "Authors",id })),
        {type:"Authors", id: "LIST"}
      ]
    })
  })
})

export const {
  useGetArticleAuthorsQuery,
  useAddAuthorMutation
} = authors