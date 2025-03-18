import { lazy } from "react";
import { redirect } from "react-router-dom";
import ManagerUsersLayout from "../../components/UI/layouts/ManagerLayout";
import VacationsLayout from "../../components/UI/layouts/VacationsLayout";


const UserCard = lazy(()=> import("../../components/manager/UserCard"))
const AllUsers = lazy(()=> import("./pages/AllUsers"))
const VacationsPage = lazy(()=> import("./pages/VacationsPage"))
const ScheduleForm = lazy(()=> import("./pages/ScheduleForm"))
const WorkoutsPage = lazy(()=> import("./pages/WorkoutsPage"))




const managerRouter = (suspenseElement, dynamicLoaderImport, dynamicActionImport)=>{

      return ({
        path: "manager", loader: dynamicLoaderImport("managers", "/api/schedule/scheduleToUpdate", "restrictLoader", true) ,  children: [
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
        },

        {path: "workouts", loader: dynamicLoaderImport("general", "/api/manager/workoutsTypes/"),
            element: suspenseElement(<WorkoutsPage/>), action: dynamicActionImport("managers", "workoutsTypesActions")
        }
        ]
      })
            
            
      
}


export const restrictLoader = async({context})=>{
    const {user} = context
    const role = user.role

    if(role !== "manager"){
        return redirect("/")
    }

    return null

    // try {
    //     const response = await fetch(apiUrl, { credentials: 'include' });
    //     const data = await response.json();
    
    //     if (!response.ok) {
    //       throw new Error(data.message || "Something went wrong");
    //     }
    
    //     return data;

    //   } catch (error) {
    //     throw new Response(
    //       JSON.stringify({ 
    //           message: error instanceof Error ? error.message : String(error) || 'Unknown error' 
    //       }),
    //       { status: 500 }
    //   );
    //   }


}

export default managerRouter