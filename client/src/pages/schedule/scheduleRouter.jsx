import { lazy } from "react";
import { Outlet } from "react-router-dom";


const SchedulePage = lazy(() => import("./SchedulePage"));
// const ResetPassPage = lazy(()=> import("./pages/resetPassPage"))

const scheduleRouter = (suspenseElement, dynamicLoaderImport, dynamicActionImport)=>{

      return (
            {path: "makeAnAppt", element: suspenseElement(<SchedulePage/>), loader: dynamicLoaderImport("general", "/api/schedule") }
      )
}

export default scheduleRouter