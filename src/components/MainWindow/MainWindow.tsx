import React from "react";

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
} from "reactstrap";

export const MainWindow = () => (
  <>
    <main>
      <section className="section section-shaped section-lg">
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
        <Container>
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
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>
                            <i className="ni ni-email-83" />
                          </InputGroupText>
                        </InputGroupAddon>
                        <Input
                          placeholder="Demo File Path"
                          id="demoPath"
                          type="text"
                        />
                        <InputGroupAddon addonType="append">
                          <Button color="success">Browse</Button>
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
                      <Button className="my-4" color="primary" type="button">
                        Play Demo
                      </Button>
                    </div>
                  </Form>
                </CardBody>
              </Card>
              <Row className="mt-3 pr-2">
                <Col className="text-right" xs="12">
                  <small>
                    Created by{" "}
                    <a className="text-light" href="https://github.com/dangmai">
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
