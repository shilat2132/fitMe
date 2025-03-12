import { lazy } from "react";
import { redirect } from "react-router-dom";


const VacationsPage = lazy(()=> import("./pages/VacationsPage"))
const WorkDetailsForm = lazy(()=> import("../../components/trainers/WorkDetailsForm"))


const trainerRouter = (suspenseElement, dynamicLoaderImport, dynamicActionImport)=>{

      return ({
        path: "trainer", loader: dynamicLoaderImport("trainers", null, "restrictLoader", true) ,  children: [
            {path: "vacations", element: suspenseElement(<VacationsPage/>),
                loader: dynamicLoaderImport("general", "/api/trainer/vacations"),
                action: dynamicActionImport("trainers", "vacationActions")
            },
            {path: "updateWorkDetails", loader: dynamicLoaderImport("general", "/api/schedule"),
                element: suspenseElement(<WorkDetailsForm/> ) , action: dynamicActionImport("trainers", "workDetailsAction")
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