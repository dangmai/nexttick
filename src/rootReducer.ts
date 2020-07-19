import { combineReducers } from "@reduxjs/toolkit";

import { appStateSlice, gameStateSlice } from "./components/Overlay/Overlay";

const rootReducer = combineReducers({
  appState: appStateSlice.reducer,
  gameState: gameStateSlice.reducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
