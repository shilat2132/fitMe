import { useLoaderData } from "react-router-dom";
import { DayPicker } from "react-day-picker";
import "react-day-picker/style.css";
import { useEffect, useReducer } from "react";
import { he } from 'date-fns/locale';


function reducer(state, action){
    switch (action.type){
        // this is called when a day is selected
        case "SET_DATE":
            // if the specific date data is already cached than set the footer to it
            if (state.cachedFooter[action.date]){
                return {...state, date: action.date, footer: state.cachedFooter[action.date]}
            }else{
                // if it isn't - set only the date to the new date and the footer to null - to sign the useEffect that it needs to call the server
                return {...state, date: action.date, footer: null}
            }
        
        // this is called after the useEffect called the server with the data on the current date and it need to be cached
        case "SET_CACHE":
            return {...state, cachedFooter: {...state.cachedFooter, [state.date]: action.footer }, footer: action.footer}
    
        default:
            return state
    }
}

export default function SchedulePage(){
    const data = useLoaderData()

    const [state, dispatch] = useReducer(reducer, {
        date: null,
        cachedFooter: {},
        footer: "Please select a day"
    })
    
    console.log(state)

    // use effect would call the server with the current date, its dependencies are only the date itself
    useEffect(()=>{
        if (!(state.date != null && state.footer == null)) return;

        async function fetchTrainersForDay() {
            try {
                const response = await fetch(`/api/schedule/${state.date}`)
                const responseData = await response.json()

                if(!response.ok || (responseData && !responseData.trainers)){
                    throw new Error(responseData ? responseData : "Something went wrong")
                }

                return responseData.trainers 
            } catch (error) {
                throw error
            }
        }

        async function setCache(){
            const footer = await fetchTrainersForDay()
            dispatch({type: "SET_CACHE", footer })
        }
        
        setCache()
    }, [state.date])
    
    
    function onSelectDayHandler(date){
        // change the date on the reducer
        // const d = new Date(date)
        // console.log(d)
        const utcDate = new Date(Date.UTC(
            date.getFullYear(), 
            date.getMonth(), 
            date.getDate(), 
            0, 0, 0, 0
        ));
        dispatch({type: "SET_DATE", date: utcDate })
        // this case of changing the date would check whether the data is already in the cache, 
        // if it is, set the data of the reducer to this data
        // if it isn't in the cache - set the data to null
        // in the useEffect, first check if the date isn't null but the data is, then call the server, set the data and set the cache, otherwise - break
    }
    
    return (<DayPicker
        animate
        mode="single"
        selected={state.date}
        onSelect={onSelectDayHandler}
        locale={he}
        footer={
          state.date ? `Selected: ${state.date.toLocaleDateString()}` : "Pick a day."
        }
      />)
}