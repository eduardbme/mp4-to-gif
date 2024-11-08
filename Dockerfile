FROM node:22.4.0-alpine

WORKDIR /app

COPY package.json .
COPY package-lock.json .
RUN npm i

COPY apps apps
COPY libs libs
COPY nx.json .
COPY tsconfig.base.json .
COPY eslint.config.js .

# Test purpose only
ENTRYPOINT ["npx", "nx", "run", "mp4-to-gif:serve"]
