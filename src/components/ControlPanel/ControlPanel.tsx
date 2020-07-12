import React from "react";

import { Button, Card, CardBody } from "reactstrap";

export const ControlPanel = () => {
  return (
    <Card className="bg-default">
      <CardBody className="d-flex justify-content-between">
        <div>
          <Button title="Previous Round" color="secondary">
            <i className="fa fa-step-backward"></i>
          </Button>
          <Button
            title="Left Click for Previous Kill/Right Click for Previous Death"
            color="secondary"
          >
            <i className="fa fa-backward"></i>
          </Button>
          <Button title="Play/Pause" color="success">
            <i className="fa fa-play"></i>
          </Button>
          <Button
            title="Left Click for Next Kill/Right Click for Next Death"
            color="secondary"
          >
            <i className="fa fa-forward"></i>
          </Button>
          <Button title="Next Round" color="secondary">
            <i className="fa fa-step-forward"></i>
          </Button>
        </div>
        <div>
          <Button title="Switch to Game Control" color="secondary">
            <i className="fa fa-window-restore fa-lg"></i>
          </Button>
          <Button title="Playback Speed" color="secondary">
            <i className="fa fa-tachometer fa-lg"></i>
          </Button>
          <Button title="More Settings" color="secondary">
            <i className="fa fa-cog fa-lg"></i>
          </Button>
        </div>
      </CardBody>
    </Card>
  );
};
