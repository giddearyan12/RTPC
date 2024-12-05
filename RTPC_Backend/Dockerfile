# Use Node.js base image
FROM node:16

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json for Node.js dependencies
COPY package*.json ./

# Install Node.js dependencies
RUN npm install

# Install `nodemon` globally
RUN npm install -g nodemon

# Install Python, pip, and necessary Python libraries
RUN apt-get update && apt-get install -y python python-pip build-essential \
  && pip install --upgrade pip \
  && pip install numpy pandas matplotlib requests \
  && apt-get clean

# Install Java (OpenJDK 11)
RUN apt-get update && apt-get install -y openjdk-11-jdk \
  && apt-get clean

# Install C++ dependencies (GCC and G++)
RUN apt-get update && apt-get install -y g++ gcc \
  && apt-get clean

# Install PHP (8.0-cli)
RUN apt-get update && apt-get install -y php \
  && apt-get clean

# Optionally, install Docker if required (you may not need this inside the container)
# RUN apt-get update && apt-get install -y docker.io

# Copy the rest of the application code
COPY . .

# Expose the port that your application will run on
EXPOSE 3000

# Command to run the Node.js app
CMD ["nodemon", "Server.js"]