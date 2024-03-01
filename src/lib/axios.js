import Axios from 'axios'

const axios = Axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  headers: {
    'X-Requested-With': 'XMLHttpRequest',
  },
  withCredentials: true,
  withXSRFToken: true
})

export default axios