FROM denoland/deno:1.10.3

EXPOSE 8080

WORKDIR /app

USER deno

ADD . .
RUN deno cache room.ts

CMD ["run", "--allow-net", "room.ts"]