import { RouterProvider, createBrowserRouter, Outlet } from "react-router";
import { Home } from "./pages/home";
import { Suspense } from 'react';

import Spinner from 'react-bootstrap/Spinner';
import { ErrorPage } from "./pages/errorPage";
import Layout from "./pages/UI/Layout";
import { rootLoader } from "./pages/auth/actions/auth";

import authRouter from "./pages/auth/authRouter";
import "./styles/general.css"
import apptRouter from "./pages/appointments/ApptRouter";





const actionModules = {
  auth: () => import('./pages/auth/actions/auth'),
  logout: ()=> import("./pages/auth/actions/logoutAction"),
  appointments: ()=> import("./pages/appointments/actions")
};

/** dynamicly loads actions functions (that are exported as default) */
export function dynamicActionImport(key, functionName=null) {
  return async function actionHandler({ request, params }) {
    if (!actionModules[key]) throw new Error(`Action not found for key: ${key}`);
    const module = await actionModules[key]();
    const func = functionName ? module[functionName] : module.default;
    return func({ request, params });
  };
}

const loaderModules = {
  general: () => import("./utils/loaders"),
};

/** dynamicly imports loaders functions (that are exported as default) */
function dynamicLoaderImport(key, apiUrl, functionName= null) {
  return async function loaderHandler({ request, params }) {
    if (!loaderModules[key]) throw new Error(`Loader not found for key: ${key}`);
    const module = await loaderModules[key]();
    const func = functionName ? module[functionName] : module.default;
    return func({ request, params, apiUrl });
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
    ...apptRouter(suspenseElement, dynamicLoaderImport, dynamicActionImport)
    
    
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
