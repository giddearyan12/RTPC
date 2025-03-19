
FROM node:16


WORKDIR /usr/src/app


COPY package*.json ./


RUN npm install


RUN npm install -g nodemon


RUN apt-get update && apt-get install -y python python-pip build-essential \
  && pip install --upgrade pip \
  && pip install numpy pandas matplotlib requests \
  && apt-get clean


RUN apt-get update && apt-get install -y openjdk-11-jdk \
  && apt-get clean


RUN apt-get update && apt-get install -y g++ gcc \
  && apt-get clean


RUN apt-get update && apt-get install -y php \
  && apt-get clean


COPY . .


EXPOSE 3000


CMD ["nodemon", "app.js"]