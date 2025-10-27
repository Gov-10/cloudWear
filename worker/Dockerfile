# syntax=docker/dockerfile:1
FROM python:3.10-slim

# Set working directory
WORKDIR /app

# Copy and install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the worker code
COPY . .

# Expose the port Cloud Run expects
EXPOSE 8080

# Start the worker (which runs both background consumer + FastAPI)
CMD ["python", "worker.py"]
