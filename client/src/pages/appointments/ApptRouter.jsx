import { lazy } from "react";


const ApptFormPage = lazy(() => import("./ApptFormPage"));
const ApptsPage = lazy(()=> import("./ApptsPage"))

const apptRouter = (suspenseElement, dynamicLoaderImport, dynamicActionImport)=>{

      return [
            {path: "makeAnAppt", element: suspenseElement(<ApptFormPage/>), 
                  loader: dynamicLoaderImport("general", "/api/schedule") , 
                  action: dynamicActionImport("appointments", "makeAnApptAction")},
            
            {path: "myAppointments", element: suspenseElement(<ApptsPage/>), 
                  loader: dynamicLoaderImport("general", "/api/user/myAppts"),
                  action: dynamicActionImport("appointments", "cancelAppt")
            }
            
      ]
}

export default apptRouter