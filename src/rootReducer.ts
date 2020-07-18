import { combineReducers } from "@reduxjs/toolkit";

import { controlPanelSlice } from "./components/Overlay/Overlay";

const rootReducer = combineReducers({
  controlPanel: controlPanelSlice.reducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
