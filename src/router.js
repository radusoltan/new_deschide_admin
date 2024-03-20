import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import {Protected} from "./components/Protected";
import {Dashboard} from "./components/Pages/Dashboard";
import {Login} from "./components/Pages/Login";
import {Categories} from "./components/Pages/Content/Categories";
import {Articles} from "./components/Pages/Content/Articles";
import {Users} from "./components/Pages/Management/Users";
import {Roles} from "./components/Pages/Management/Roles";
import {Permissions} from "./components/Pages/Management/Permissions";
import {Category} from "./components/Pages/Content/Categories/Category";
import {Article} from "./components/Pages/Content/Articles/Article";
import {ArticleImages} from "./components/Pages/Content/Images/ArticleImages";
import {Authors} from "./components/Pages/Content/Authors";
import {Author} from "./components/Pages/Content/Authors/Author";
import {Lists} from "./components/Pages/Content/Lists";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Protected />,
    children: [
      {
        path: "/",
        element: <Dashboard />,
      },
      {
        path: "/content/categories",
        element: <Categories />
      },
      {
        path: '/content/category/:category',
        element: <Category />
      },
      {
        path: "/content/articles",
        element: <Articles />
      },
      {
        path: "/content/article/:article",
        element: <Article />
      },
      {
        path: "/content/article/:article/images",
        element: <ArticleImages />
      },
      {
        path: "/content/authors",
        element: <Authors />
      },
      {
        path: '/content/author/:author',
        element: <Author />
      },
      {
        path: '/content/lists',
        element: <Lists />
      },
      {
        path: "/management/users",
        element: <Users />
      },
      {
        path: '/management/roles',
        element: <Roles />,
      },
      {
        path: '/management/permissions',
        element: <Permissions />
      }
    ],
  },
  {
    path: '/login',
    element: <Login />
  }
]);