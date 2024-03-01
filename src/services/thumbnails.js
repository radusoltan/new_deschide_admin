import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";

const baseUrl = process.env.REACT_APP_API_URL

export const thumbnails = createApi({
  reducerPath: 'thumbnails',
  baseQuery: fetchBaseQuery({
    baseUrl,
    prepareHeaders: (headers,{getState})=>{
      const token = getState().auth.userToken
      if (token) {
        headers.set('authorization', `Bearer ${token}`)
      }
    }
  }),
  tagTypes: ["Thumbnails"],
  endpoints: build => ({
    getImageThumbnails: build.query({
      query: image => `/image/${image}/thumbnails`,
      providesTags: result => [
          ...result.map(th=>({type:"Thumbnails",id:th.id})),
        {type:"Images",id: "LIST"}
      ]
    }),
    cropImage: build.mutation({
      query: ({image,rendition,crop})=>({
        url: `/image/${image}/crop`,
        method: "POST",
        body: {rendition, crop}
      }),
    }),
    getRenditions: build.query({
      query: ()=> '/renditions'
    })
  })
})

export const {
  useGetImageThumbnailsQuery,
  useCropImageMutation,
  useGetRenditionsQuery
} = thumbnails