import { createSlice } from "@reduxjs/toolkit";

export const panelSlice = createSlice({
  name: "data",
  initialState: {
    value: [],
    searching_state: false,
    searching_state_name: "no_search"
    // possible states: 
    // no_search: initial search state when page first loads
    // empty: search yields 0 results
    // done: search completed with 1 or more result
    // error: search returns anything that is not 200
  },
  reducers: {
    addToPanel: (state, action) => {
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based off those changes

      action.payload.forEach((element) => state.value.push(element));
    },
    updatePanel: (state, action) => {
      state.value = action.payload;
    },
    emptyPanel: (state) => {
      state.value = [];
    },
    isSearching: (state) => {
      state.searching_state = true;
    },
    doneSearching: (state) => {
      state.searching_state = false;
    },
    updateSearchState:(state, action) =>
      {
        state.searching_state_name= action.payload;
      }
  },
});

export const { addToPanel, updatePanel, emptyPanel, isSearching, doneSearching, updateSearchState} = panelSlice.actions;

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state) => state.counter.value)`
export const selectDataList = (state) => state.data.value;
export const selectLength = (state) => state.data.value.length;
export const selectSearchState = (state) => state.data.searching_state_name;

export default panelSlice.reducer;
