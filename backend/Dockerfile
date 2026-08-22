FROM node:20-slim

RUN apt-get update -y && apt-get install -y openssl

WORKDIR /app

COPY package*.json tsconfig.json ./
COPY prisma ./prisma/

RUN npm ci

COPY src ./src

RUN npx prisma generate
RUN npm run build

EXPOSE 5000

CMD ["npm", "start"]
