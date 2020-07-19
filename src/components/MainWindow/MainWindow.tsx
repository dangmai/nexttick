import React, { useEffect, useState, MouseEvent } from "react";

// reactstrap components
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  FormGroup,
  Form,
  Input,
  InputGroupAddon,
  InputGroupText,
  InputGroup,
  Container,
  Label,
  Row,
  Col,
  Spinner,
} from "reactstrap";

import * as api from "../../api";

export const MainWindow = () => {
  const [demoPath, setDemoPath] = useState("");
  const [demoLoading, setDemoLoading] = useState(false);
  useEffect(() => {
    document.title = "NextTick - Main";
  }, []);
  const handleChooseDemo = async (e: MouseEvent) => {
    e.preventDefault();
    const { ipcRenderer } = window.require("electron");
    ipcRenderer.on("demoPath", (_event: any, arg: string) => {
      setDemoPath(arg);
    });
    ipcRenderer.send("chooseDemo");
  };
  const handlePlayDemo = async (e: MouseEvent) => {
    e.preventDefault();
    if (demoPath) {
      setDemoLoading(true);
      const result = await api.playDemo(demoPath);
      console.log(result);
      setDemoLoading(false);
    } else {
      console.log("No demo chosen");
    }
  };
  return (
    <>
      <main>
        <section className="section section-shaped pt-4">
          <div className="shape shape-style-1 bg-gradient-default">
            <span />
            <span />
            <span />
            <span />
            <span />
            <span />
            <span />
            <span />
          </div>
          <Container style={{ maxWidth: "95%" }}>
            <Row className="justify-content-center">
              <Col>
                <Card className="bg-secondary shadow border-0">
                  <CardHeader
                    style={{ display: "flex", justifyContent: "center" }}
                    className="bg-white pb-1"
                  >
                    <img
                      alt="Main Banner"
                      style={{ width: "350px" }}
                      src={require("./nexttick-banner.png")}
                    />
                  </CardHeader>
                  <CardBody className="px-lg-5 py-lg-5">
                    <Form role="form">
                      <FormGroup className="mb-3">
                        <Label
                          id="demo-path-label"
                          className="d-flex justify-content-center"
                          for="demoPath"
                        >
                          <h5 className="text-uppercase text-success">
                            Choose Demo File
                          </h5>
                        </Label>
                        <InputGroup className="input-group-alternative">
                          <Input
                            placeholder="Demo File Path"
                            id="demoPath"
                            type="text"
                            value={demoPath}
                            onClick={handleChooseDemo}
                            readOnly={true}
                          />
                          <InputGroupAddon addonType="append">
                            <Button color="success" onClick={handleChooseDemo}>
                              Browse
                            </Button>
                          </InputGroupAddon>
                        </InputGroup>
                      </FormGroup>
                      <FormGroup>
                        <Label
                          id="demo-path-label"
                          className="d-flex justify-content-center"
                          for="share-code-input"
                        >
                          <h5 className="text-uppercase text-success">
                            Use Demo Share Code
                          </h5>
                        </Label>
                        <InputGroup className="input-group-alternative">
                          <InputGroupAddon addonType="prepend">
                            <InputGroupText>
                              <i className="ni ni-lock-circle-open" />
                            </InputGroupText>
                          </InputGroupAddon>
                          <Input
                            placeholder="Demo Share Code"
                            type="text"
                            id="share-code-input"
                          />
                        </InputGroup>
                      </FormGroup>
                      <div className="text-center">
                        <Button
                          disabled={demoPath === "" || demoLoading}
                          className="my-4"
                          color="primary"
                          type="button"
                          onClick={handlePlayDemo}
                        >
                          {demoLoading ? (
                            <Spinner color="secondary" />
                          ) : (
                            "Play Demo"
                          )}
                        </Button>
                      </div>
                    </Form>
                  </CardBody>
                </Card>
                <Row className="mt-3 pr-2">
                  <Col className="text-right" xs="12">
                    <small>
                      Created by{" "}
                      <a
                        className="text-light"
                        href="https://github.com/dangmai"
                      >
                        @dangmai
                      </a>
                    </small>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Container>
        </section>
      </main>
    </>
  );
};
