import { Children, lazy } from "react";
import { redirect } from "react-router-dom";


// const ApptFormPage = lazy(() => import("./ApptFormPage"));
const VacationsPage = lazy(()=> import("./pages/VacationsPage"))
// const UpdateDetailsForm = lazy(()=> import("../../components/account/UpdateDetailsForm"))


const trainerRouter = (suspenseElement, dynamicLoaderImport, dynamicActionImport)=>{

      return ({
        path: "trainer", loader: dynamicLoaderImport("trainers", null, "restrictLoader", true) ,  children: [
            {path: "vacations", element: suspenseElement(<VacationsPage/>),
                loader: dynamicLoaderImport("general", "/api/trainer/vacations"),
                action: dynamicActionImport("trainers", "vacationActions")
            }
        ]
      })
            
            
      
}


export const restrictLoader = ({context})=>{
    const {user} = context
    const role = user.role

    if(role !== "trainer"){
        return redirect("/")
    }
    return null
}

export default trainerRouter