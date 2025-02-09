FROM denoland/deno:2.1.9

EXPOSE 8002
WORKDIR /benchmarks/deno-2

COPY . .

RUN deno cache main.ts

CMD ["deno", "run", "--env-file", "--allow-env", "--allow-net", "main.ts"]