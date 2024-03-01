import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react"

const baseUrl = process.env.REACT_APP_API_URL

export const authApi = createApi({
  reducerPath: 'authApi',
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
  endpoints: build => ({
    getUserDetails: build.query({
      query: () => ({
        url: 'user',
        method: "GET"
      })
    })
  })
})

export const {
  useGetUserDetailsQuery
} = authApi