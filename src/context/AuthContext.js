import {createContext, useEffect, useReducer} from "react";
import {projectAuth} from "../firebase/config";

export const AuthContext = createContext();

export const authReducer = (state, action) => {
    switch (action.type) {
        case 'AUTH_IS_READY':
            return {...state, user: action.payload, authIsReady: true}
        case 'LOGIN':
            return {...state, user: action.payload}
        case 'LOGOUT':
            return {...state, user: null}
        default:
            return state
    }
}

export const AuthContextProvider = ({children}) => {

    const [state, dispatch] = useReducer(authReducer, {
        user: null,
        authIsReady: false,
    })

    // This code will run only once when the component is evaluated
    useEffect(() => {
        // Will communicate with firebase and sak for an update whenever there's an
        // update on authentication and when there is I want to fire this function.
        //
        // This function will run always a first time, and also every time there is a change
        // in authentication.
        const unsub = projectAuth.onAuthStateChanged((user) => {
            dispatch({type: 'AUTH_IS_READY', payload: user})
            unsub() // this is never going to fire again
        })
    }, [])

    console.log('AuthContext state:', state)

    return (
        <AuthContext.Provider value={{...state, dispatch}}>
            {children}
        </AuthContext.Provider>
    )
}