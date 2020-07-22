import React, { useRef, useEffect, FunctionComponent } from "react";
import { useDispatch } from "react-redux";

import ReconnectingWebSocket from "reconnecting-websocket";

import { Message } from "../../../backend/message";
import { appStateSlice, gameStateSlice } from "../Overlay/Overlay";

interface WebsocketProps {
  onConnectionOpened?: () => any;
}
export const Websocket: FunctionComponent<WebsocketProps> = (props) => {
  const ws = useRef<ReconnectingWebSocket | null>(null);
  const dispatch = useDispatch();
  const { onConnectionOpened } = props;

  useEffect(() => {
    console.log("WebSocket hook is running");
    ws.current = new ReconnectingWebSocket("ws://localhost:5001");
    ws.current.onopen = () => {
      console.log("ws opened");
      if (onConnectionOpened) {
        onConnectionOpened();
      }
    };
    ws.current.onclose = () => console.log("ws closed");

    ws.current.onmessage = (e) => {
      const message: Message = JSON.parse(e.data);
      if (message.type === "gsi") {
        dispatch(gameStateSlice.actions.setGameState(message.gameState));
      } else {
        console.log("App received state change message");
        const { type, ...newAppState } = message;
        dispatch(appStateSlice.actions.setAppState(newAppState));
        if (window.require) {
          const { ipcRenderer } = window.require("electron");
          ipcRenderer.send("stateChanged", message);
        }
      }
    };
    return () => {
      ws.current?.close();
    };
  }, [dispatch, onConnectionOpened]);

  return <>{props.children}</>;
};
