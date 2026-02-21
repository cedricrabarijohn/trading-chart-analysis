# Docker Setup Guide

This guide covers the Docker setup for the Chart Analysis application.

## 🏗️ Architecture

The Docker setup includes:

- **Multi-stage production build** (Dockerfile)
- **Development environment with hot-reload** (Dockerfile.dev)
- **Docker Compose orchestration** (docker-compose.yml)
- **Makefile automation** for common tasks

## 📦 Images

### Production Image (Dockerfile)
- **Base**: Node.js 20 Alpine
- **Package Manager**: pnpm
- **Build Type**: Multi-stage (deps → builder → runner)
- **Output**: Standalone Next.js build
- **Size**: Optimized (~150MB)
- **User**: Non-root (nextjs)

### Development Image (Dockerfile.dev)
- **Base**: Node.js 20 Alpine
- **Features**: Hot-reload, volume mounting
- **Dependencies**: All dev dependencies included

## 🚀 Quick Start

### 1. Setup Environment

```bash
# Create .env file
make env

# Edit .env with your API keys
nano .env
```

### 2. Start Development

```bash
# Start with hot-reload (logs in foreground)
make dev

# OR start in background
make up
```

### 3. Access Application

Open [http://localhost:3000](http://localhost:3000)

## 📝 Common Commands

### Development Workflow

```bash
# Start dev server
make dev

# View logs
make logs

# Restart after dependency changes
make restart

# Access container shell
make shell

# Stop container
make down
```

### Production Workflow

```bash
# Build production image
make prod-build

# Start production container
make prod-up

# View production logs
docker-compose logs -f chart-analysis

# Stop production
make prod-down
```

## 🔧 Configuration

### Environment Variables

Both production and development containers require:

```env
XAI_API_KEY=your_xai_api_key
NEXT_PUBLIC_TWELVE_DATA_API_KEY=your_twelve_data_api_key
```

### Ports

- **3000**: Application port (mapped to host:3000)

### Volumes (Development Only)

```yaml
volumes:
  - .:/app                    # Source code
  - /app/node_modules         # Preserve node_modules
  - /app/.next                # Preserve build cache
```

## 🔍 Troubleshooting

### Port Already in Use

```bash
# Check what's using port 3000
lsof -i :3000

# Or use a different port in docker-compose.yml
ports:
  - "3001:3000"
```

### Dependency Changes Not Reflected

```bash
# Rebuild the image
docker-compose build chart-analysis-dev

# Or clean and restart
make clean
make up
```

### Permission Issues

```bash
# Fix file permissions
sudo chown -R $USER:$USER .
```

### View Container Logs

```bash
# Development
make logs

# Production
docker-compose logs -f chart-analysis
```

### Enter Container for Debugging

```bash
# Development container
make shell

# Production container
docker-compose exec chart-analysis sh
```

## 🏗️ Build Process

### Production Build Stages

1. **Base**: Install pnpm
2. **Deps**: Install dependencies only
3. **Builder**: Copy deps and build application
4. **Runner**: Copy built files, minimal runtime

### Why Multi-stage?

- **Smaller image**: Final image doesn't include build tools
- **Faster builds**: Dependencies cached in separate layer
- **Security**: Production runs as non-root user

## 🎯 Best Practices

### For Development

```bash
# Always use make commands
make dev          # ✅ Good
docker-compose up # ❌ Avoid (use Makefile)

# Keep .env updated
# Restart after changing .env
make restart
```

### For Production

```bash
# Build before deploying
make prod-build

# Use environment-specific .env files
cp .env.production .env
make prod-up

# Monitor logs
docker-compose logs -f chart-analysis
```

## 🧹 Cleanup

### Remove Containers and Volumes

```bash
# Clean everything
make clean

# Manual cleanup
docker-compose down -v
docker system prune -a
```

### Remove Images

```bash
# Remove specific images
docker rmi chart-analysis-chart-analysis
docker rmi chart-analysis-chart-analysis-dev

# Remove all unused images
docker image prune -a
```

## 🔐 Security

### Production Image

- ✅ Runs as non-root user (nextjs:nodejs)
- ✅ Minimal attack surface (Alpine base)
- ✅ No dev dependencies in production
- ✅ Standalone build (no source code)

### Environment Variables

- ⚠️ Never commit .env files
- ⚠️ Use secrets management in production
- ⚠️ Rotate API keys regularly

## 📊 Resource Usage

### Typical Resource Consumption

```
Development:
  - CPU: 10-20% (1 core)
  - RAM: 200-400MB
  - Disk: ~500MB

Production:
  - CPU: 5-10% (1 core)
  - RAM: 100-200MB
  - Disk: ~150MB
```

## 🚢 Deployment

### Deploy to Production Server

```bash
# 1. Copy files to server
scp -r . user@server:/path/to/app

# 2. SSH to server
ssh user@server

# 3. Setup and start
cd /path/to/app
make env
# Edit .env with production keys
make prod-build
make prod-up
```

### Using Docker Hub

```bash
# Tag image
docker tag chart-analysis-chart-analysis username/chart-analysis:latest

# Push to registry
docker push username/chart-analysis:latest

# Pull and run on server
docker pull username/chart-analysis:latest
docker-compose up -d chart-analysis
```

## 📚 Additional Resources

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [Next.js Docker Documentation](https://nextjs.org/docs/deployment#docker-image)
