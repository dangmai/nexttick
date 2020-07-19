import http from "http";
import express, { Request, Response, NextFunction } from "express";
import WebSocket from "ws";
import cors from "cors";
import bodyParser from "body-parser";

const app = express();

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });
let ws: WebSocket;

app.use(cors());
app.set("port", process.env.PORT || 5001);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post("/ws/appstate", (req, res) => {
  if (ws) {
    const message = {
      type: "change",
      ...req.body,
    };
    ws.send(JSON.stringify(message));
  }
  res.send("Done");
});
app.post("/ws/gamestate", (req, res) => {
  if (ws) {
    const message = {
      type: "gsi",
      ...req.body,
    };
    ws.send(JSON.stringify(message));
  }
  res.send("Done");
});

app.post("*", (req, res) => {
  console.log(
    `Received ${req.method} request at ${
      req.originalUrl
    }, body: ${JSON.stringify(req.body)}`
  );
  res.send("Pong");
});

class HttpException extends Error {
  status: number;
  message: string;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
    this.message = message;
  }
}

function errorMiddleware(
  error: HttpException,
  request: Request,
  response: Response,
  next: NextFunction
) {
  const status = error.status || 500;
  const message = error.message || "Something went wrong";
  response.status(status).send({
    status,
    message,
  });
}
app.use(errorMiddleware);

wss.on("connection", function connection(conn) {
  console.log("Websocket connection established");
  ws = conn;
});
server.listen(app.get("port"), () => {
  console.log(
    "  App is running at http://localhost:%d in %s mode",
    app.get("port"),
    app.get("env")
  );
});
