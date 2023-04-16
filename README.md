# Rooms

This repo explores a scenario where you want many instances of the same container image.

The advantage of this is that it allows you to keep the state of each instance separate.

This architecture can make sense for running a multiplayer game server at an edge location close to your users.

# How it works

`server.ts` is responsible for starting instances of the container. On request to `/my-room-name`, it starts a container by that name if none exists already, and responds with its URL. `client.ts` is then free to connect to it over Websockets.

The container shuts itself down if there have been no active connections for a few seconds.

## Requirements

- Docker
- Deno

## How to run

Build the image: `docker build -t room .`

Start the server: `deno run --allow-net --allow-run server.ts`

Start a client which connects to my-room-name: `deno run --allow-net client.ts my-room-name`
