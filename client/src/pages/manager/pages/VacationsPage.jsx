import { useLoaderData } from "react-router-dom";
import AllVacations from "../../../components/trainers/AllVacations";




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
    {approved && <h3>Approved Vacations</h3>}
    {!approved && <h3>Vacations To Approve</h3>}
    <AllVacations from="manager" vacations={vacations} />
    </>)
}

