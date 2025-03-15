FROM node:18-alpine AS development

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm install -g ts-node-dev

EXPOSE 4001

CMD ["npm", "run", "dev"]

FROM node:18-alpine AS production

WORKDIR /app

COPY package*.json ./

RUN npm install

RUN npm install -g typescript

COPY . .

RUN npm run build

EXPOSE 4001

CMD ["npm", "start"]
