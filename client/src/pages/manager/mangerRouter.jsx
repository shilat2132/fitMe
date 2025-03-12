import { lazy } from "react";
import { redirect } from "react-router-dom";
import ManagerUsersLayout from "../../components/UI/layouts/ManagerLayout";
import VacationsLayout from "../../components/UI/layouts/VacationsLayout";


const UserCard = lazy(()=> import("../../components/manager/UserCard"))
const AllUsers = lazy(()=> import("./pages/AllUsers"))
const VacationsPage = lazy(()=> import("./pages/VacationsPage"))
const ScheduleForm = lazy(()=> import("./pages/ScheduleForm"))




const managerRouter = (suspenseElement, dynamicLoaderImport, dynamicActionImport)=>{

      return ({
        path: "manager", loader: dynamicLoaderImport("managers", null, "restrictLoader", true) ,  children: [
           {path: "users", 
            element: <ManagerUsersLayout/>,
            action: dynamicActionImport("managers", "deleteUserAction") ,
            children: [
            {path: "trainers", children: [
                {index: true, loader: dynamicLoaderImport("general", "/api/manager/trainers"),
                    element: suspenseElement(<AllUsers isTrainees={false}/>)},

                {path: ":id", loader: dynamicLoaderImport("general", "/api/manager/trainers" ),
                    element: suspenseElement(<UserCard/>)
                }
            ]
            },
            {path: "trainees", children: [
                {index: true, loader: dynamicLoaderImport("general", "/api/manager/trainees"),
                    element: suspenseElement(<AllUsers isTrainees={true}/>)},
                {path: ":id", loader: dynamicLoaderImport("general", "/api/manager/trainees" ),
                    element: suspenseElement(<UserCard/>), action: dynamicActionImport("managers", "userToTrainerAction")
                }
            ]
            }
           ]},

           {path: "vacations", element: suspenseElement(<VacationsLayout/>) , children: [
            {path: "approved", loader: dynamicLoaderImport("general", "/api/manager/trainers/vacations"),
                element: suspenseElement(<VacationsPage approved={true}/>),
                action: dynamicActionImport("managers", "updateVacationAction")
             },
             {path: "toApprove", loader: dynamicLoaderImport("general", "/api/manager/trainers/vacations/toApprove"),
                element: suspenseElement(<VacationsPage approved={false}/>),
                action: dynamicActionImport("managers", "updateVacationAction")
             }
        ]},

        {path: "schedule", loader: dynamicLoaderImport("general", "/api/schedule/scheduleToUpdate"),
            element: suspenseElement(<ScheduleForm/>), action: dynamicActionImport("managers", "scheduleActions")
        }
        ]
      })
            
            
      
}


export const restrictLoader = ({context})=>{
    const {user} = context
    const role = user.role

    if(role !== "manager"){
        return redirect("/")
    }
    return null
}

export default managerRouter