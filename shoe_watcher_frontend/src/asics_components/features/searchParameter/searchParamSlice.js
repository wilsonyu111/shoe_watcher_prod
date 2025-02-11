import { createSlice } from "@reduxjs/toolkit"


// new Map(Object.entries({gender:[], shoe_name:"test_shoe", sorting_style:"A-Z", search_limit:20}))
export const searchParamSlice = createSlice({
  name: "searchParam",
  initialState: {
    
    value: {
      gender:[],
      condition:[],
      shoe_name:"",
      sorting_style: "A-Z",
      search_limit: 40,
      token_key: "",
      token_value: "",
      sfccid: "",
      hasNext: "false",
      min_price: 0,
      max_price: 400,
    }
  },
  reducers: {
    updateParam: (state, action) => {
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based off those changes
      switch(action.payload.key){
        case "gender":
          state.value.gender = action.payload.value
          break
        case "shoe_name":
          state.value.shoe_name = action.payload.value
          break
        case "sorting_style":
          state.value.sorting_style = action.payload.value
          break
        case "search_limit":
          state.value.search_limit = action.payload.value
          break
        case "min_price":
          state.value.min_price = action.payload.value
          break
        case "max_price":
          state.value.max_price = action.payload.value
          break
        case "condition":
          state.value.condition = action.payload.value
          break

      }
      
    },
    updatePagination: (state, action) => {
      if (action.payload.hasNext)
      {
        state.value.token_key = action.payload.token_key
        state.value.token_value = action.payload.token_value
        state.value.sfccid = action.payload.sfccid
      }
      state.value.hasNext = action.payload.hasNext
    }
  },
})

export const { updateParam, updatePagination} = searchParamSlice.actions

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state) => state.counter.value)`
export const selectGenderList = (state) => state.searchParam.value.gender
export const selectConditionList = (state) => state.searchParam.value.condition
export const selectShoeName = (state) => state.searchParam.value.shoe_name
export const selectSortingStyle = (state) => state.searchParam.value.sorting_style
export const selectSearchLimit = (state) => state.searchParam.value.search_limit
export const selectParamDic = (state) => state.searchParam.value.gender
export const selectHasNext = (state) => state.searchParam.value.hasNext

export default searchParamSlice.reducer
