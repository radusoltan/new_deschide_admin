import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react"
import i18n from "../i18n";

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
      query: id => `/articles/${id}&locale=${i18n.language}`,
    }),
    getCategoryArticles: build.query({
      query: ({page, category})=> `/category/${category}/articles?page=${page}&locale=${i18n.language}`,
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
      invalidatesTags: ({id}) => [
          { type: "Articles", id },
        { type: "Articles", id: "LIST" }
      ]
    }),
    setArticlePublishTime: build.mutation({
      query: ({id, body}) => ({
        url: `/article/${id}/publish-time`,
        method: "POST",
        body
      }),
      invalidatesTags: result => [{type: "Articles", id: result.id}]
    }),
    deleteArticlePublishTime: build.mutation({
      query: id => ({
        url: `/translation/${id}/delete-event`,
        method: "DELETE"
      }),
      invalidatesTags: response => [{type: "Articles", id: response.id}]
    })
  })
})

export const {
  useGetArticleQuery,
  useUpdateArticleMutation,
  useGetCategoryArticlesQuery,
  useAddArticleMutation,
  useSetArticlePublishTimeMutation,
  useDeleteArticlePublishTimeMutation
} = articles