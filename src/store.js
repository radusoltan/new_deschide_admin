import {configureStore} from "@reduxjs/toolkit";
import authReducer from './features/auth/authSlice'
import {authApi} from "./services/auth";
import {categories} from "./services/categories";
import {articles} from "./services/articles";
import {images} from "./services/images";
import {thumbnails} from "./services/thumbnails";
import {authors} from "./services/authors";
import {users} from "./services/users";
import {artilcesList} from "./services/articlesList";

const store = configureStore({
  reducer: {
    auth: authReducer,
    [authApi.reducerPath]: authApi.reducer,
    [categories.reducerPath]: categories.reducer,
    [articles.reducerPath]: articles.reducer,
    [images.reducerPath]: images.reducer,
    [thumbnails.reducerPath]: thumbnails.reducer,
    [authors.reducerPath]: authors.reducer,
    [users.reducerPath]: users.reducer,
    [artilcesList.reducerPath]: artilcesList.reducer

  },
  middleware: getDefaultMiddleware => getDefaultMiddleware().concat(
    authApi.middleware,
    categories.middleware,
    articles.middleware,
    images.middleware,
    thumbnails.middleware,
    authors.middleware,
    users.middleware,
    artilcesList.middleware
  )
})

export default store