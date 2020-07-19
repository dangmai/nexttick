import { combineReducers } from "@reduxjs/toolkit";

import { appStateSlice } from "./components/Overlay/Overlay";

const rootReducer = combineReducers({
  appState: appStateSlice.reducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
