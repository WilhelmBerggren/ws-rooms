import type { WebSocketClient } from "https://deno.land/x/websocket@v0.1.4/mod.ts";
import { WebSocketServer } from "https://deno.land/x/websocket@v0.1.4/mod.ts";

const wss = new WebSocketServer(8080);

console.log("Server started on port 8080");

setInterval(() => {
  if ([...wss.clients].filter((c) => !c.webSocket.isClosed).length === 0) {
    console.log("No clients connected, closing server");

    Deno.exit(0);
  }
}, 5000);

wss.on("connection", function (ws: WebSocketClient) {
  ws.on("message", function (message: string) {
    console.log(message);
    ws.send(message);
  });
  ws.on("close", function (code: number, reason: string) {
    console.log(code, reason);
  });
  ws.on("error", function (err: Error) {
    console.log(err);
  });
});
