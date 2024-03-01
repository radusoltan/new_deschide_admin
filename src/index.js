import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App'
import {Provider} from "react-redux";
import store from "./store";
import i18n from "./i18n";
import 'antd-button-color/dist/css/style.css';

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
    <Provider store={store}>

      <App />

    </Provider>
)