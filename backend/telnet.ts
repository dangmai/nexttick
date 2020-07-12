import Telnet from "telnet-client";

let connection: Telnet;

export async function sendCommands(commands: string | string[]) {
  let requestCommand;
  if (typeof commands === "string") {
    requestCommand = commands;
  } else {
    requestCommand = commands.join(";");
  }
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

  try {
    await connection.send(requestCommand);
  } catch (err) {
    // console.log(err);
  }
}
