FROM node:18-bullseye

# نصب ffmpeg و build tools
RUN apt-get update && \
    apt-get install -y ffmpeg build-essential python3 && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package.json .
COPY server.js .

# نصب تمام dependencyها
RUN npm install

EXPOSE 3000

CMD ["node", "server.js"]
