import { useLoaderData } from "react-router-dom";
import { DayPicker } from "react-day-picker";
import "react-day-picker/style.css";
import { useEffect, useReducer } from "react";
import { he } from 'date-fns/locale';
import ApptForm from "../../components/appointments/ApptForm";
import styles from "../../styles/appts.module.css"
import { suspenseElement } from "../../App";
import { Spinner } from "react-bootstrap";

function reducer(state, action){
    switch (action.type){
        // this is called when a day is selected
        case "SET_DATE":
            // if the specific date data is already cached than set the footer to it
            if (state.cachedFooter[action.date]){
                const data = state.cachedFooter[action.date]
                return {...state, date: action.date, footer: data.footer, error: data.error}
            }else{
                // if it isn't - set only the date to the new date and the footer to null - to sign the useEffect that it needs to call the server
                return {...state, date: action.date, footer: null, isLoading: true}
            }
        
        // this is called after the useEffect called the server with the data on the current date and it need to be cached
        case "SET_CACHE":
            return {...state, isLoading: false, cachedFooter: {...state.cachedFooter, [state.date]: {footer: action.footer, error: action.error} }, 
                footer: action.footer, error: action.error}
        
        case "RESET_FOOTER":
            return {...state, date: null, footer: "Please select a day", error: false, isLoading: true}
    
        default:
            return state
    }
}

export default function ApptFormPage(){
    const data = useLoaderData()
    
    if (!data.schedule){
        const errorMsg = data.error || "Something went wrong"
        return (<div className="errorMessage container">{errorMsg}</div>)
    }

    const {maxDaysForward} = data.schedule

    const [state, dispatch] = useReducer(reducer, {
        date: null,
        cachedFooter: {},
        footer: "Please select a day",
        error: false,
        isLoading: true
    })
    

    // use effect would call the server with the current date, its dependencies are only the date itself
    useEffect(()=>{
        if (!(state.date != null && state.footer == null)) return;

        async function fetchTrainersForDay() {
            try {
                const response = await fetch(`/api/schedule/${state.date}`)
                const responseData = await response.json()

                if(!response.ok || (responseData && !responseData.trainers)){
                    let footer = "Something went wrong"
                    if (responseData && responseData.message){
                        footer = responseData.message
                    }
                    return {error: true, footer: <p style={{color: "red"}}>{ footer}</p> }
                }

                return {error: false, footer: responseData.trainers }
            } catch (error) {
                return {error: true, footer: <p style={{color: "red"}}>{ responseData ? responseData : "Something went wrong"}</p> }
            }
        }

        async function setCache(){
           try {
            const result = await fetchTrainersForDay()
            dispatch({type: "SET_CACHE", footer: result.footer, error: result.error })
           
            
           } catch (error) {
            dispatch({type: "SET_CACHE", error: true, footer: <p style={{color: "red"}}>Something went wrong</p> })
           }
        }
        
        setCache()
    }, [state.date])
    
    
    function onSelectDayHandler(date){
        if (!date){
            dispatch({type: "RESET_FOOTER"})
            return;
        }
        // change the date on the reducer
        const utcDate = new Date(Date.UTC(
            date.getFullYear(), 
            date.getMonth(), 
            date.getDate(), 
            0, 0, 0, 0
        ));
        dispatch({type: "SET_DATE", date: utcDate })
        
    }

    let footer;
    if(!state.date){
        footer = "Pick a day"
    }else{
        if(state.error){
            footer = state.footer
        }else{
            if(state.isLoading){
                footer = <Spinner className="loading-fallback" animation="border" role="status">
                            <span className="visually-hidden">Loading...</span>
                         </Spinner>
            }else{
                footer = <ApptForm  date={state.date} trainers={state.footer ? state.footer : {}}/>
            }
            
        }
        
    }
    

    const allowedRange = {
        from: new Date(),
        to: new Date()
    }
    allowedRange.to.setDate(allowedRange.to.getDate()+ maxDaysForward- 1)
    const modifiers = {
        disabled: { before: allowedRange.from, after: allowedRange.to },
      };

    return (<DayPicker
        className={`${styles.dayPicker} container`}
        animate
        mode="single"
        selected={state.date}
        onSelect={onSelectDayHandler}
        modifiers={modifiers}
        locale={he}
        footer={ footer }
      />)
}