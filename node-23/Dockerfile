FROM node:23.7.0-slim

WORKDIR /benchmarks/node-23
COPY package*.json ./
COPY index.ts ./
COPY .env ./

RUN npm install

CMD ["node", "index.ts"]
