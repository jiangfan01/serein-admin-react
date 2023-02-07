import React from "react"
import ReactDOM from "react-dom/client"
import {
    createBrowserRouter, Navigate,
    RouterProvider,
} from "react-router-dom";
import zhCN from "antd/locale/zh_CN";
import {ConfigProvider} from "antd";
import "./index.css"

//路由路径
import Login from "./routers/auth/login.jsx";
import Root from "./routers/layout/root.jsx";
import Index from "./routers/home/index.jsx";
import ErrorPage from "./routers/errors/error-page.jsx";
import CategoriesList from "./routers/categories/index.jsx";
import CategoriesCreate from "./routers/categories/create.jsx";
import CategoriesEdit from "./routers/categories/edit.jsx";
import CoursesList from "./routers/courses/index.jsx";
import CoursesCreate from "./routers/courses/create.jsx";
import CoursesEdit from "./routers/courses/edit.jsx";
import ArticlesList from "./routers/articles/index.jsx";
import ArticlesCreate from "./routers/articles/create.jsx";
import ArticlesEdit from "./routers/articles/edit.jsx";
import UsersList from "./routers/users/index.jsx";
import UsersEdit from "./routers/users/edit.jsx";
import ChaptersList from "./routers/chapters/index.jsx";
import ChaptersCreate from "./routers/chapters/create.jsx";
import ChaptersEdit from "./routers/chapters/edit.jsx";

import {getToken} from "../utils/auth.js";

const RequireAuth = ({ children }) => {
    const token = getToken();
    if (!token) {
        return <Navigate to="/login"/>;
    }


    return children;
}

const router = createBrowserRouter([
    {
        path: "login",
        element: <Login/>
    },
    {
        path: "/",
        element:
            <RequireAuth>
            <Root/>,
            </RequireAuth>,
        errorElement: <ErrorPage/>,
        children: [
            {index: true, element: <Index/>},
            {
                path: "categories",
                element: <CategoriesList/>,
            },
            {
                path: "categories/create",
                element: <CategoriesCreate/>,
            },
            {
                path: "categories/edit/:id",
                element: <CategoriesEdit/>,
            },
            {
                path: "courses",
                element: <CoursesList/>,
            },
            {
                path: "courses/create",
                element: <CoursesCreate/>,
            },
            {
                path: "courses/edit/:id",
                element: <CoursesEdit/>,
            },
            {
                path: "chapters",
                element: <ChaptersList/>,
            },
            {
                path: "chapters/create",
                element: <ChaptersCreate/>,
            },
            {
                path: "chapters/edit/:id",
                element: <ChaptersEdit/>,
            },
            {
                path: "articles",
                element: <ArticlesList/>,
            },
            {
                path: "articles/create",
                element: <ArticlesCreate/>,
            },
            {
                path: "articles/edit/:id",
                element: <ArticlesEdit/>,
            },
            {
                path: "users",
                element: <UsersList/>,
            },
            {
                path: "users/edit/:id",
                element: <UsersEdit/>,
            },
        ],

    },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
    <ConfigProvider locale={zhCN}>
        <RouterProvider router={router} locale={zhCN}/>
    </ConfigProvider>
)
