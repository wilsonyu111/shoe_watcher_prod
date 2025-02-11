import { createSlice } from "@reduxjs/toolkit";

// new Map(Object.entries({gender:[], shoe_name:"test_shoe", sorting_style:"A-Z", search_limit:20}))
export const messageSlice = createSlice({
  name: "message",
  initialState: {
    value: {
      showMessage: false,
      messageContent: "",
    },
  },
  reducers: {
    updateMessageStatus: (state, action) => {
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based off those changes
      switch (action.payload.key) {
        case "showMessage":
          state.value.showMessage = action.payload.value;
          break;
        case "messageContent":
          state.value.messageContent = action.payload.value;
          break;
      }
    },
  },
});

export const { updateShowMessage } = messageSlice.actions;

export const selectShowMessage = (state) => state.message.value.showMessage;
export const selectMessageContent = (state) =>
  state.message.value.messageContent;

export default messageSlice.reducer;
