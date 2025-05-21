
FROM node:16


WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install
RUN npm install -g nodemon


RUN apt-get update && \
    apt-get install -y python3 python3-pip && \
    pip3 install --no-cache-dir numpy pandas matplotlib requests


RUN apt-get install -y openjdk-11-jdk


RUN apt-get install -y gcc g++

RUN apt-get install -y php


RUN apt-get clean && rm -rf /var/lib/apt/lists/*


COPY . .


EXPOSE 3000


CMD ["nodemon", "app.js"]
