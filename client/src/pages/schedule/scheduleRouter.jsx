import { lazy } from "react";


const SchedulePage = lazy(() => import("./SchedulePage"));

const scheduleRouter = (suspenseElement, dynamicLoaderImport, dynamicActionImport)=>{

      return (
            {path: "makeAnAppt", element: suspenseElement(<SchedulePage/>), loader: dynamicLoaderImport("general", "/api/schedule") }
      )
}

export default scheduleRouter