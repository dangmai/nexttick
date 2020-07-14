import Telnet from "telnet-client";

let connection: Telnet;

async function connectToServer() {
  if (!connection) {
    console.log("Connecting to Telnet server");
    connection = new Telnet();
    await connection.connect({
      host: "localhost",
      port: 23243,
      timeout: 10000,
      negotiationMandatory: false,
    });
    console.log("Connection done");
  }
}
export async function sendCommands(
  commands: string | string[]
): Promise<string | undefined> {
  let requestCommand;
  if (typeof commands === "string") {
    requestCommand = commands;
  } else {
    requestCommand = commands.join(";");
  }
  connectToServer();

  try {
    const result = await connection.send(requestCommand);
    return result;
  } catch (err) {
    if (err.message === "socket not writable") {
      await connectToServer();
      sendCommands(commands);
    } else if (err.message !== "response not received") {
      throw err;
    }
  }
}
