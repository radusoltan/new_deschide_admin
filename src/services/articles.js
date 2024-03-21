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
  tagTypes: ["Articles", "Authors"],
  endpoints: build => ({
    getArticle: build.query({
      query: id => `/articles/${id}&locale=${i18n.language}`,
      providesTags: ({id,authors}) => [
        { type: "Article", id },
        ...authors.map(({id})=>({ type: "Authors", id })),
        { type: "Authors", id: "LIST" }
      ]
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
    }),

    getAuthors: build.query({
      query: ()=>'/all-authors',
      providesTags: result => [
        ...result.map(author=>({ type: "Authors", id: result.id })),
        { type: "Authors", id: "LIST" }
      ]
    }),
    getArticleAuthors: build.query({
      query: article => `/article/${article}/authors`,
      providesTags: result => [
        ...result.map(author=>({ type: "Authors", id: result.id })),
        { type: "Authors", id: "LIST" }
      ]
    }),
    addArticleAuthor: build.mutation({
      query: ({article, body}) => ({
        url: `/article/${article}/authors`,
        method: "POST",
        body
      }),
      invalidatesTags: result => [
        ...result.map(author=>({ type: "Authors", id: result.id })),
        { type: "Authors", id: "LIST" }
      ]
    }),
    deleteArticleAuthor: build.mutation({
      query: ({article, author}) => ({
        url: `/article/${article}/authors/${author}`,
        method: "DELETE"
      }),
      invalidatesTags: result => [
        ...result.map(({id})=>({type:'Authors',id})),
        {type:'Authors',id:'LIST'}
      ]
    }),
    authorsSearch: build.mutation({
      query: q => ({
        url: `/authors/search`,
        method: "POST",
        body: {q, locale: i18n.language}
      })
    })





  })
})

export const {
  useGetArticleQuery,
  useUpdateArticleMutation,
  useGetCategoryArticlesQuery,
  useAddArticleMutation,
  useSetArticlePublishTimeMutation,
  useDeleteArticlePublishTimeMutation,

  useGetAuthorsQuery,
  useAddArticleAuthorMutation,
  useGetArticleAuthorsQuery,
  useDeleteArticleAuthorMutation,
  useAuthorsSearchMutation
} = articles