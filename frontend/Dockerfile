FROM node:18.16.0-bullseye-slim

WORKDIR /app

COPY package.json .

RUN npm install --omit=dev

COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev"]
