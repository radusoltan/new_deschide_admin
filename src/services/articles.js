import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react"

const baseUrl = process.env.REACT_APP_API_URL

export const articles = createApi({
  reducerPath: 'articles',
  baseQuery: fetchBaseQuery({
    baseUrl,
    prepareHeaders: (headers,{getState})=>{
      const token = getState().auth.userToken
      if (token) {
        headers.set('authorization', `Bearer ${token}`)
      }
    }
  }),
  tagTypes: ["Articles"],
  endpoints: build => ({
    getArticle: build.query({
      query: id => `/articles/${id}`,
    }),
    getCategoryArticles: build.query({
      query: ({page, category})=> `/category/${category}/articles?page=${page}`,
      providesTags: response => response ? [
        ...response.data.map(({id})=>({type:'Articles',id}))
      ] : [{type:'Articles',id:'PARTIAL-LIST'}]
    }),
    addArticle: build.mutation({
      query: ({category,body})=>({
        url: `/category/${category}/add-article`,
        method: "POST",
        body
      }),
      invalidatesTags: response => [
        [{ type: "Articles", id: response.id }],
        { type: "Articles", id: "PARTIAL-LIST" }
      ]
    }),
    updateArticle: build.mutation({
      query: ({article, body}) => ({
        url: `/articles/${article}`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: ({id}) => [{ type: "Articles", id }]
    })
  })
})

export const {
  useGetArticleQuery,
  useUpdateArticleMutation,
  useGetCategoryArticlesQuery,

  useAddArticleMutation
} = articles