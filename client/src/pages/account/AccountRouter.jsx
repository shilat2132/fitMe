import { lazy } from "react";
import { redirect } from "react-router-dom";


// const ApptFormPage = lazy(() => import("./ApptFormPage"));
const AccountLayout = lazy(()=> import("../../components/UI/AccountLayout"))
const UpdateDetailsForm = lazy(()=> import("../../components/account/UpdateDetailsForm"))


const accountRouter = (suspenseElement, dynamicLoaderImport, dynamicActionImport)=>{

      return (
        {path: "me", element: suspenseElement(<AccountLayout/>), 
            loader: dynamicLoaderImport("general", null, "protectedRouteLoader", true), children: [
                {index: true, loader: redirectLoader},
                {path: "updateMe", element: suspenseElement(<UpdateDetailsForm  key="updateDetails" type="updateDetails"/>), 
                    action: dynamicActionImport("account")},
                {path: "updatePassword", element: suspenseElement(<UpdateDetailsForm  key="updatePassword" type="updatePassword"/>),
                    action: dynamicActionImport("account")
                }
            ]}
        )
            
            
      
}


const redirectLoader = ()=>{
    return redirect("/me/updateMe")
}
export default accountRouter