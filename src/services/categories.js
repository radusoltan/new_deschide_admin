import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react"
import i18n from "../i18n";
import {useNavigate} from "react-router-dom";

const baseUrl = process.env.REACT_APP_API_URL

export const categories = createApi({
  reducerPath: 'categories',
  baseQuery: fetchBaseQuery({
    baseUrl,
    prepareHeaders: (headers, {getState}) =>{
      const token = getState().auth.userToken
      if (token){
        headers.set('authorization', `Bearer ${token}`)
        return headers
      }
    }
  }),
  tagTypes: ["Categories","Articles"],
  endpoints: build => ({
    getCategories: build.query({
      query: (page) => `/categories?page=${page}`,
      providesTags: result => result ? [
        ...result.data.map(({id})=>({type: 'Categories',id})),
        {type: 'Categories', id: 'PARTIAL-LIST'}
      ] : [{type: 'Categories', id: 'PARTIAL-LIST'}]
    }),
    getCategory: build.query({
      query: category => `/categories/${category}`
    }),

    addCategory: build.mutation({
      query: data => ({
        url: '/categories',
        method: 'POST',
        body: data
      }),
      invalidatesTags: result => [
          [{ type: "Categories", id: result.id }],
        {type: "Categories",id: "PARTIAL-LIST"}
      ]
    }),
    updateCategory: build.mutation({
      query: ({id,body}) => ({
        url: `/categories/${id}`,
        method: 'PATCH',
        body
      }),
      invalidatesTags: result => [
          [{ type: "Categories", id: result.id }],
        {type: "Categories", id: "PARTIAL-LIST"}
      ]
    }),
    deleteCategory: build.mutation({
      query: id => ({
        url: `/categories/${id}?locale=${i18n.language}`,
        method: 'DELETE'
      }),
      invalidatesTags: (r,o,e) => [
        [{type: "Categories", id: e}],
        {type: "Categories", id: "PARTIAL-LIST"}
      ]
    }),

  })
})

export const {
  useGetCategoriesQuery,
  useGetCategoryQuery,

    useAddCategoryMutation,
    useUpdateCategoryMutation,
    useDeleteCategoryMutation,
} = categories