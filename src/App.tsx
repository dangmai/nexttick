import React from "react";
import { configureStore } from "@reduxjs/toolkit";
import { Provider as ReduxProvider } from "react-redux";
import { HashRouter as Router, Switch, Route } from "react-router-dom";

import "fontsource-open-sans";

import "bootstrap/dist/css/bootstrap.css";
import "argon-design-system-react/src/assets/scss/argon-design-system-react.scss";
import "argon-design-system-react/src/assets/vendor/font-awesome/css/font-awesome.css";

import rootReducer from "./rootReducer";
import { Debug } from "./components/Debug/Debug";
import { Websocket } from "./components/Websocket/Websocket";
import { Overlay } from "./components/Overlay/Overlay";
import { Preferences } from "./components/Preferences/Preferences";
import { MainWindow } from "./components/MainWindow/MainWindow";

const store = configureStore({
  reducer: rootReducer,
});

export function App() {
  return (
    <ReduxProvider store={store}>
      <Router>
        <Switch>
          <Route path="/overlay">
            <Websocket>
              <Overlay />
            </Websocket>
          </Route>
          <Route path="/preferences">
            <Preferences />
          </Route>
          <Route path="/debug">
            <Debug />
          </Route>
          <Route path="/">{<MainWindow />}</Route>
        </Switch>
      </Router>
    </ReduxProvider>
  );
}
