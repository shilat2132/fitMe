import { RouterProvider, createBrowserRouter, Outlet } from "react-router";
import { Home } from "./pages/home";
import { Suspense } from 'react';

import Spinner from 'react-bootstrap/Spinner';
import { ErrorPage } from "./pages/errorPage";
import Layout from "./pages/UI/Layout";
import { rootLoader } from "./pages/auth/actions/auth";

import authRouter from "./pages/auth/authRouter";
import "./styles/general.css"
import scheduleRouter from "./pages/schedule/scheduleRouter";





const actionModules = {
  auth: () => import('./pages/auth/actions/auth'),
  logout: ()=> import("./pages/auth/actions/logoutAction")
};

/** dynamicly loads actions functions (that are exported as default) */
export function dynamicActionImport(key) {
  return async function actionHandler({ request, params }) {
    if (!actionModules[key]) throw new Error(`Action not found for key: ${key}`);
    const module = await actionModules[key]();
    return module.default({ request, params });
  };
}

const loaderModules = {
  general: () => import("./utils/loaders"),
};

/** dynamicly imports loaders functions (that are exported as default) */
function dynamicLoaderImport(key, apiUrl) {
  return async function loaderHandler({ request, params }) {
    if (!loaderModules[key]) throw new Error(`Loader not found for key: ${key}`);
    const module = await loaderModules[key]();
    return module.default({ request, params, apiUrl });
  };
}




/** returns the Suspense element with the given component */
export function suspenseElement(component){
  return (
    <Suspense fallback={
      <Spinner className="loading-fallback" animation="border" role="status">
        <span className="visually-hidden">Loading...</span>
      </Spinner>
    }>
      {component}
    </Suspense>
  )
}


const router = createBrowserRouter([
  {path: "/", element: <Layout/>, errorElement: <ErrorPage/>, loader: rootLoader , children:[
    {index: true, element: <Home/>},
    authRouter( suspenseElement, dynamicActionImport ),
    scheduleRouter(suspenseElement, dynamicLoaderImport, dynamicActionImport)
    
    
  ]}
])

function App() {
  return (
    <Suspense fallback={
      <Spinner className="loading-fallback" animation="border" role="status">
        <span className="visually-hidden">Loading...</span>
      </Spinner>
    }>
      <RouterProvider router={router}/>
    </Suspense>
  );
}
export default App
