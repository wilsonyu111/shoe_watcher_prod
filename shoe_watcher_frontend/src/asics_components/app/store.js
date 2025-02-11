import { configureStore } from "@reduxjs/toolkit"
import dataReducer from "../features/dataList/panelSlice"
import paramReducer from "../features/searchParameter/searchParamSlice"
import authReducer from "../features/auth/authSlice"
import signupReducer from "../features/auth/signUpSlice"
import messageReducer from "../features/auth/messageSlice"

export default configureStore({

  reducer: {
    data: dataReducer,
    searchParam: paramReducer,
    auth: authReducer,
    signup: signupReducer,
    message: messageReducer,
  },

})
