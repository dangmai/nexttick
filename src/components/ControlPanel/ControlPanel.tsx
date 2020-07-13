import React, { MouseEvent } from "react";

import "./ControlPanel.css";

interface ControlPanelProps {
  handlePlayPause: (e: MouseEvent) => void;
  handlePreviousRound: (e: MouseEvent) => void;
  handleNextRound: (e: MouseEvent) => void;
}
export const ControlPanel = (props?: ControlPanelProps) => {
  return (
    <div
      id="control-panel"
      className="d-flex justify-content-between pb-3 pt-3"
      style={{ paddingLeft: "22%", paddingRight: "22%" }}
    >
      <div>
        <i
          className="fa fa-play fa-lg mx-5"
          title="Play/Pause"
          onClick={props?.handlePlayPause}
        ></i>
        <i
          className="fa fa-step-backward fa-lg mr-5"
          title="Previous Round"
          onClick={props?.handlePreviousRound}
        ></i>
        <i
          className="fa fa-step-forward fa-lg mr-5"
          title="Next Round"
          onClick={props?.handleNextRound}
        ></i>
      </div>
      <div>
        <i
          className="fa fa-window-restore fa-lg mr-5"
          title="Switch to Game Control"
        ></i>
        <i className="fa fa-tachometer fa-lg mr-5" title="Playback Speed"></i>
        <i className="fa fa-cog fa-lg" title="More Settings"></i>
      </div>
    </div>
  );
};
