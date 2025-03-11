import { lazy } from "react";


const ApptFormPage = lazy(() => import("./ApptFormPage"));
const ApptsPage = lazy(()=> import("./ApptsPage"))

const apptRouter = (suspenseElement, dynamicLoaderImport, dynamicActionImport)=>{

      return [
            {path: "makeAnAppt", element: suspenseElement(<ApptFormPage/>), 
                  loader: dynamicLoaderImport("general", "/api/schedule") , 
                  action: dynamicActionImport("appointments", "makeAnApptAction")},
            
            {path: "appointments", loader: dynamicLoaderImport("general", null, "protectedRouteLoader", true) , children: [
                  {index: true, element: suspenseElement(<ApptsPage/>), 
                        loader: dynamicLoaderImport("appts"),
                        action: dynamicActionImport("appointments", "cancelAppt")
                  }
            ]}
            
      ]
}

export default apptRouter