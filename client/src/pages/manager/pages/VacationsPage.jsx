import { useLoaderData } from "react-router-dom";
import AllVacations from "../../../components/trainers/AllVacations";


// export default function VacationsToApprove(){
//     const {docs: vacations, amount} = useLoaderData()


//     return (<>
//     <h1>Vacations To Approve</h1>
//     <AllVacations from="manager" vacations={vacations} all={true}/>
//     </>)
// }

export default function VacationsPage({approved}){
    const {docs: vacations, amount} = useLoaderData()

    
    if(amount<=0){
        let msg = <p className="message">There aren't any vacations to be approved</p>

        if(approved){
            msg = <p className="message">There aren't any approved vacations</p>
        }

        return <>{msg} </>
    }
    return (<>
    {approved && <h1>Approved Vacations</h1>}
    {!approved && <h1>Vacations To Approve</h1>}
    <AllVacations from="manager" vacations={vacations} />
    </>)
}

