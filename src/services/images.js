import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

const baseUrl = process.env.REACT_APP_API_URL

export const images = createApi({
  reducerPath: 'images',
  baseQuery: fetchBaseQuery({
    baseUrl,
    prepareHeaders: (headers,{getState})=>{
      const token = getState().auth.userToken
      if (token){
        headers.set('authorization', ` Bearer ${token}`)
      }
    }
  }),
  tagTypes: ["Images"],
  endpoints: build => ({
    getImagesByArticle: build.query({
      query: article => `/article/${article}/images`,
      providesTags: result => [
          ...result.map(({id})=>({type: "Images", id})),
        {type: "Images", id: "LIST"}
      ]
    }),
    detachArticleImage: build.mutation({
      query: ({article,id}) => ({
        url: `/article/${article}/detach-images`,
        method: "POST",
        body: {id}
      }),
      invalidatesTags: result => [
        [{type: "Images", id: result.id}],
        {type: "Images", id: "LIST"}
      ]
    }),
    uploadArticleImages: build.mutation({
      query: ({article,body}) => ({
        url: `/article/${article}/upload-images`,
        method: "POST",
        body,
      }),
      invalidatesTags: result => result ? [
          ...result.map(({id})=>({type:"Images",id})),
        {type:"Images",id: "LIST"}
      ] : [{type:"Images",id: "LIST"}]
    }),
    setArticleMainImage: build.mutation({
      query: ({article,image}) => ({
        url: `/image/set-main`,
        method: "POST",
        body: {article, image}
      }),
      invalidatesTags: ({image_id}) => [
          [{ type: "Images", id: image_id }],
        {type:"Images",id: "LIST"}
      ]
    })
  })
})

export const {
  useGetImagesByArticleQuery,
  useUploadArticleImagesMutation,
  useSetArticleMainImageMutation,
  useDetachArticleImageMutation
} = images