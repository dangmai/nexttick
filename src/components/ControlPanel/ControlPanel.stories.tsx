import React from "react";
import { configureStore } from "@reduxjs/toolkit";
import { Provider as ReduxProvider } from "react-redux";

import { ConnectedControlPanel } from "./ControlPanel";
import rootReducer from "../../rootReducer";

import "bootstrap/dist/css/bootstrap.css";
import "argon-design-system-react/src/assets/scss/argon-design-system-react.scss";
import "argon-design-system-react/src/assets/vendor/font-awesome/css/font-awesome.css";

const store = configureStore({
  reducer: rootReducer,
});

export default {
  component: ConnectedControlPanel,
  title: "ControlPanel",
  decorators: [
    (storyFn: typeof ConnectedControlPanel, context: any) => (
      <ReduxProvider store={store}>
        <div style={{ position: "relative", width: "1920px" }}>
          <img
            alt="CSGO"
            src="https://i.imgur.com/OS0EHHg.jpg"
            style={{ maxWidth: "100%" }}
          />
          <div style={{ position: "absolute", bottom: 0, width: "inherit" }}>
            {storyFn()}
          </div>
        </div>
      </ReduxProvider>
    ),
  ],
};

export const defaultControlPanel = () => <ConnectedControlPanel />;
