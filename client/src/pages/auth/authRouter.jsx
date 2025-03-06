import { lazy } from "react";
// import { dynamicActionImport, suspenseElement } from "../../App";
import { Outlet } from "react-router-dom";


const AuthPage = lazy(() => import("./pages/authPage"));
const ResetPassPage = lazy(()=> import("./pages/resetPassPage"))

const authRouter = (suspenseElement, dynamicActionImport)=>{

      return (
            {path: "auth", children: [
                  {path: "logout", action: dynamicActionImport("logout"), element: <Outlet/>},
            
                  // type: signup, login, forgotPassword
                  {path: ":type", element: suspenseElement(<AuthPage/>) , action: dynamicActionImport("auth")},
                  {path: "resetPassword/:token", element: suspenseElement(<ResetPassPage/>), action: dynamicActionImport("auth") }
            ]}
      )
}

export default authRouter