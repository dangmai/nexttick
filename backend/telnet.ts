import Telnet from "telnet-client";

let connection: Telnet | null;

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
  try {
    await connectToServer();
    const result = await connection?.send(requestCommand);
    return result;
  } catch (err) {
    if (err.message === "socket not writable") {
      await connectToServer();
      await sendCommands(commands);
    } else if (err.message !== "response not received") {
      connection = null;
      throw err;
    }
  }
}
