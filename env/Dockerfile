# SmartInbox RL Environment - OpenEnv-compatible container
FROM python:3.10-slim

# Set working directory
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    curl \
    git \
    && rm -rf /var/lib/apt/lists/*

# Copy project files
COPY . /app

# Install OpenEnv core framework
RUN pip install --no-cache-dir openenv-core>=0.1.0

# Install project dependencies
RUN pip install --no-cache-dir \
    openai>=1.0.0 \
    pydantic>=2.0.0 \
    pyyaml>=6.0 \
    numpy>=1.24.0 \
    python-dotenv>=1.0.0

# Expose environment server port
EXPOSE 8000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:8000/health || exit 1

# Run the SmartInbox environment server
CMD ["python", "-m", "openenv.server", "--host", "0.0.0.0", "--port", "8000", "--config", "openenv.yaml"]
