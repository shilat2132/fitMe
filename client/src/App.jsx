import { RouterProvider, createBrowserRouter, Outlet } from "react-router";
import { Home } from "./pages/home";
import { Suspense } from 'react';

import Spinner from 'react-bootstrap/Spinner';
import { ErrorPage } from "./pages/errorPage";
import Layout from "./components/UI/Layout";
import { rootLoader } from "./utils/loaders";

import authRouter from "./pages/auth/authRouter";
import "./styles/general.css"
import apptRouter from "./pages/appointments/ApptRouter";
import accountRouter from "./pages/account/AccountRouter";
import trainerRouter from "./pages/trainers/trainersRouter";



const actionModules = {
  auth: () => import('./pages/auth/actions/auth'),
  logout: ()=> import("./pages/auth/actions/logoutAction"),
  appointments: ()=> import("./pages/appointments/actions"),
  account: ()=> import("./pages/account/actions"),
  trainers: ()=> import("./pages/trainers/actions")
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
  appts: ()=> import("./pages/appointments/loaders"),
  trainers: ()=> import("./pages/trainers/trainersRouter")
};

/** dynamicly imports loaders functions 
 *  - if a functionName is given - it imports it from the module, otherwise it imports the default exported function
 *  - apiUrl is the endpoint for the server request the loader would send
 *  - if getRootLoaderData is set to true - we send the data to the loader given from the root loader (mostly used for protectRouteLoader)
 */
function dynamicLoaderImport(key, apiUrl, functionName= null, getRootLoaderData = false) {
  return async function loaderHandler({ request, params }) {
    if (!loaderModules[key]) throw new Error(`Loader not found for key: ${key}`);
    const module = await loaderModules[key]();
    const func = functionName ? module[functionName] : module.default;

    let context
    if(getRootLoaderData){
      const rootData = await rootLoader()
      context = { isLoggedIn: rootData.isLoggedIn, user: rootData.user }
    }

    return func({ request, params, apiUrl, context })
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
  {path: "/", id: "root", element: <Layout/>, errorElement: <ErrorPage/>, loader: rootLoader , children:[
    {index: true, element: <Home/>},
    authRouter( suspenseElement, dynamicActionImport ),
    ...apptRouter(suspenseElement, dynamicLoaderImport, dynamicActionImport),
    accountRouter(suspenseElement, dynamicLoaderImport, dynamicActionImport),
    trainerRouter(suspenseElement, dynamicLoaderImport, dynamicActionImport)
    
    
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
