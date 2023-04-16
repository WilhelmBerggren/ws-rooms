import type { WebSocketClient } from "https://deno.land/x/websocket@v0.1.4/mod.ts";
import { StandardWebSocketClient } from "https://deno.land/x/websocket@v0.1.4/mod.ts";
import { sleep } from "https://deno.land/x/sleep@v1.2.1/mod.ts";

const response = await fetch(`http://localhost:8080/${Deno.args[0]}`);
const endpoint = await response.text();

console.log({ endpoint });

await sleep(2);

const ws: WebSocketClient = new StandardWebSocketClient(`ws://${endpoint}`);
ws.on("open", function () {
  console.log("ws connected!");
  let message = "";
  while (message !== "exit") {
    message = prompt("Enter a message to send to the server:") ?? "";
    if (message) {
      ws.send(message);
    }
  }
  ws.close(1000);
});
ws.on("message", function (message: string) {
  console.log(message);
});
