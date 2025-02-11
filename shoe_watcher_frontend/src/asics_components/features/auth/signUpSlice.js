import { createSlice } from "@reduxjs/toolkit"


// new Map(Object.entries({gender:[], shoe_name:"test_shoe", sorting_style:"A-Z", search_limit:20}))
export const signupSlice = createSlice({
  name: "signup",
  initialState: {
    
    value: {

      signupStatus:"", 
    }
  },
  reducers: {
    updateSignupStatus: (state, action) => {
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based off those changes
      switch(action.payload.key){
        case "signup_status":
          state.value.signupStatus = action.payload.value
          break

      }
      
    },
  },
})

export const { updateSignupStatus } = signupSlice.actions


export const selectSignupStatus = (state) => state.signup.value.signupStatus

export default signupSlice.reducer
