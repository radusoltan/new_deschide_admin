import {createAsyncThunk} from "@reduxjs/toolkit";
import axios from "../../lib/axios";


export const userLogin = createAsyncThunk(
    'auth/login',
    async ({email,password},{rejectWithValue }) => {
      try {

        const response = await axios.post('login',{email, password})

        if (response.status === 200) {
          // store user's token in local storage
          localStorage.setItem('userToken', response.data.token)
          return response.data
        } else {
          return rejectWithValue(response)
        }

      } catch (e) {
        // return custom error message from API if any
        if (e.response && e.response.data.message) {
          return rejectWithValue(e.response.data.message)
        } else {
          return rejectWithValue(e.message)
        }
      }
    }
)