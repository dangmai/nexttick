import React from "react";
import { ControlPanel } from "./ControlPanel";

export default {
  component: ControlPanel,
  title: "ControlPanel",
  decorators: [
    (storyFn: typeof ControlPanel) => (
      <div style={{ position: "relative", width: "1920px" }}>
        <img
          alt="CSGO"
          src="https://i.imgur.com/OS0EHHg.jpg"
          style={{ maxWidth: "100%" }}
        />
        <div style={{ position: "fixed", bottom: 0, width: "inherit" }}>
          {storyFn()}
        </div>
      </div>
    ),
  ],
};

export const defaultControlPanel = () => <ControlPanel />;
