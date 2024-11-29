# Use the official Python image as a base image
FROM python:3.10-slim

# Set the working directory inside the container
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Install pyttsx3 library
RUN pip install --no-cache-dir pyttsx3

# Default command to keep the container running interactively
CMD ["python"]
