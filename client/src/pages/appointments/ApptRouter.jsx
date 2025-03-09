import { lazy } from "react";


const ApptFormPage = lazy(() => import("./ApptFormPage"));

const apptRouter = (suspenseElement, dynamicLoaderImport, dynamicActionImport)=>{

      return (
            {path: "makeAnAppt", element: suspenseElement(<ApptFormPage/>), loader: dynamicLoaderImport("general", "/api/schedule") }
      )
}

export default apptRouter