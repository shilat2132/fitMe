import { Routes, Route, RouterProvider, createBrowserRouter } from "react-router";
import { Home } from "./pages/home";
import { lazy, Suspense } from 'react';

import Spinner from 'react-bootstrap/Spinner';
import { ErrorPage } from "./pages/errorPage";
import Layout from "./pages/UI/Layout";
import { rootLoader } from "./pages/auth/auth";

const AuthPage = lazy(() => import("./pages/auth/authPage"));

async function authAction({ request }) {
  // console.log(request.params)
  // const { type } = request.params;
  const module = await import('./pages/auth/auth');
  return module.authAction({ request });
}



const router = createBrowserRouter([
  {path: "/", element: <Layout/>, errorElement: <ErrorPage/>, loader: rootLoader , children:[
    {index: true, element: <Home/>},
    {path: "auth/:type", element: <Suspense fallback={
                  <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </Spinner>
                }>
                  <AuthPage/>
                </Suspense>, action: authAction}
  ]}
])

function App() {
  return <RouterProvider router={router}/>
}

export default App
