import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react"
import i18n from "../i18n";

const baseUrl = process.env.REACT_APP_API_URL

export const artilcesList = createApi({
  reducerPath: "articlesList",
  baseQuery: fetchBaseQuery({
    baseUrl,
    prepareHeaders: (headers, {getState})=>{
      const token = getState().auth.userToken
      if (token){
        headers.set('authorization',`Bearer ${token}`)
      }
    }
  }),
  tagTypes: ["Articles","Lists"],
  endpoints: build => ({
    getLists: build.query({
      query: ()=>'/lists',
      providesTags: result => [
          ...result.map(list=>({ type: 'Lists', id: result.id })),
        { type: 'Lists', id: "LIST" }
      ]
    }),
    getList: build.query({
      query: list => `/lists/${list}`,
      providesTags: result => [
        result.map(
          res=>(
            {type: "Lists", id: res.article_list_id},
            { type: "Articles", id: res.article_id }
          )
        ),
        { type: 'Lists', id: "LIST" },
        { type: 'Articles', id: "LIST" }
      ]
    }),
    getArticleLists: build.query({
      query: (article)=>`/lists/${article}/article`,
      providesTags: result => [
        result.map(list=>({type: "Lists", id: list.id})),
        { type: 'Lists', id: "LIST" }
      ]

    }),
    addArticlesList: build.mutation({
      query: body => ({
        url: '/lists',
        method: "POST",
        body
      }),
      invalidatesTags: result => [
        { type: "Lists", id: result.id },
        { type: 'Lists', id: "LIST" }
      ]
    }),
    addArticleToList: build.mutation({
      query: ({list, body}) => ({
        url: `/list/${list}/attach`,
        method: "POST",
        body
      }),
      invalidatesTags: result => [
        { type: "Lists", id: result.id },
        ...result.articles.map(article=>({ type: "Articles", id: article.id })),
        { type: 'Lists', id: "LIST" },
        { type: 'Articles', id: "LIST" }
      ]
    }),
    deleteArticleFromList: build.mutation({
      query: ({list,article})=> ({
        url: `/list/${list}/detach`,
        method: "POST",
        body: {article}
      }),
      invalidatesTags: result => [
        { type: "Lists", id: result.id },
        ...result.articles.map(article=>({ type: "Articles", id: article.id })),
        { type: 'Lists', id: "LIST" },
        { type: 'Articles', id: "LIST" }
      ]
    }),
    updateOrder: build.mutation({
      query: ({list, body})=>({
        url: `/lists/${list}/reorder`,
        method: "POST",
        body
      }),
      invalidatesTags: result => console.log(result)
    })
  })
})

export const {
  useGetListsQuery,
  useGetListQuery,
  useAddArticlesListMutation,
  useAddArticleToListMutation,
  useDeleteArticleFromListMutation,
  useUpdateOrderMutation,
    useGetArticleListsQuery

} = artilcesList