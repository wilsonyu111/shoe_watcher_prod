import { createSlice } from "@reduxjs/toolkit"


// new Map(Object.entries({gender:[], shoe_name:"test_shoe", sorting_style:"A-Z", search_limit:20}))
export const authSlice = createSlice({
  name: "auth",
  initialState: {
    
    value: {
      loggedIn: false,
      expiredAuth: false,
    }
  },
  reducers: {
    updateLoginStatus: (state, action) => {
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based off those changes
      switch(action.payload.key){
        case "loginStatus":
          state.value.loggedIn = action.payload.value
          break
        case "expiredAuth":
          state.value.expiredAuth = action.payload.value
          break

      }
      
    },
  },
})

export const { updateLoginStatus} = authSlice.actions


export const selectLoginState = (state) => state.auth.value.loggedIn
export const selectExpiredAuth = (state) => state.auth.value.expiredAuth

export default authSlice.reducer
