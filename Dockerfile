FROM node:12

WORKDIR /app

COPY package*.json ./

COPY . .

RUN npm install


EXPOSE 80
CMD [ "node", "client.js" ]