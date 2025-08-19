FROM node:18

# نصب ffmpeg
RUN apt-get update && apt-get install -y ffmpeg

WORKDIR /app

COPY package.json .
COPY server.js .

RUN npm install

EXPOSE 3000

CMD ["node", "server.js"]
