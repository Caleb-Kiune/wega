FROM python:3.9-slim

WORKDIR /app

# Copy requirements first for better caching
COPY backend/requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the backend code
COPY backend/ .

# Expose the port
EXPOSE 5000

# Set environment variables
ENV FLASK_ENV=production
ENV PYTHONPATH=/app
ENV PORT=5000

# Create a startup script
RUN echo '#!/bin/bash\ncd /app\npython test_app.py' > /app/start.sh
RUN chmod +x /app/start.sh

# Run the application
CMD ["/app/start.sh"] 