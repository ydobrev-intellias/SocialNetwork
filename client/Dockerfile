FROM node:18-alpine AS builder

WORKDIR /app

ARG BUILD_ENV=production

COPY package.json package-lock.json ./
RUN npm install

COPY . .

RUN if [ "$BUILD_ENV" = "production" ]; then npm run build; fi

FROM node:18-alpine AS production

WORKDIR /app

COPY --from=builder /app/package.json /app/package-lock.json /app/
COPY --from=builder /app/dist /app/dist

RUN npm install --production

RUN npm install -g vite

EXPOSE 4173

CMD ["npm", "run", "preview"]

FROM node:18-alpine AS development

WORKDIR /app

COPY --from=builder /app/package.json /app/package-lock.json /app/

RUN npm install

RUN npm install -g vite

EXPOSE 5173

CMD ["npm", "run", "dev"]
