import {createSlice} from "@reduxjs/toolkit";
import {userLogin} from "./authActions";


const userToken = localStorage.getItem('userToken')
  ? localStorage.getItem('userToken')
  : null

const initialState = {
  loading: false,
  userInfo: null,
  permissions: [],
  userToken,
  error: null,
  success: false
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: state => {
      localStorage.removeItem('userToken')
      state.loading = false
      state.userInfo = null
      state.userToken = null
      state.error = null
      state.permissions = []
      window.location = '/login'
    },
    setCredentials: (state, { payload }) => {

      const permissions = payload.roles.map(role=>role.permissions)

      state.userInfo = payload.user
      state.permissions = permissions.flat()
    },
  },
  extraReducers: builder => {
    builder
      .addCase(userLogin.pending, (state, action)=>{
        state.loading = true
        state.error = null
      })
      .addCase(userLogin.fulfilled, (state, {payload})=>{
        state.loading = false
        state.userInfo = payload.user
        state.userToken = payload.token
        state.permissions = payload.permissions
      })
      .addCase(userLogin.rejected, (state,{payload})=>{
        state.loading = false
        state.error = payload
      })
  }
})

export const { logout, setCredentials } = authSlice.actions
export default authSlice.reducer