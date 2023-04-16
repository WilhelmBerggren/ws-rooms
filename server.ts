import { exec, OutputMode } from "https://deno.land/x/exec@0.0.5/mod.ts";

const port = 8080;
const server = Deno.listen({ port });

for await (const conn of server) {
  serveHttp(conn);
}

type ContainerInfo = { name: string; id: string; port: string };

async function findRoom(containerName: string) {
  const psCmd = `docker ps --format '{{ json . }}'`;
  const jsonCmd = `jq -s 'map({id:.ID,name:.Names,port:.Ports})'`;

  const cmd = `bash -c "${psCmd} | ${jsonCmd}"`;
  const { output } = await exec(cmd, { output: OutputMode.Capture });
  const rooms = JSON.parse(output) as ContainerInfo[];

  return rooms.find((r) => r.name === containerName);
}

async function findOrStartRoom(containerName: string) {
  let room = await findRoom(containerName);

  if (!room) {
    const cmd = `docker run -d -p 0:8080 --name ${containerName} --rm -it room`;
    await exec(cmd, { output: OutputMode.Capture });
    room = await findRoom(containerName);
  }

  return room?.port.split("->")[0];
}

async function serveHttp(conn: Deno.Conn) {
  const httpConn = Deno.serveHttp(conn);

  for await (const requestEvent of httpConn) {
    const roomId = new URL(requestEvent.request.url).pathname.split("/")[1];
    const roomUrl = await findOrStartRoom(roomId);

    requestEvent.respondWith(new Response(roomUrl, { status: 200 }));
  }
}
