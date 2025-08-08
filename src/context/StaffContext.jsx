import { createContext, useReducer } from "react";


export const StaffContext = createContext({
    staffs: []
})


function staffReducer(state, action) {


}



export default function StaffContextProvider({ children }) {
    const [staffState, staffDispatch] = useReducer(
        staffReducer,
        {
            staffs: [],
        }
    )

    const ctxValue = {
        staffs: staffState.staffs
    }

    return (
        <StaffContext.Provider value={ctxValue}>{children}</StaffContext.Provider>
    )

}


