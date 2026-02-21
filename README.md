# Chart Analysis

AI-Powered Trading Chart Analysis with real-time forex data visualization and intelligent trade predictions.

## 🚀 Features

- **Real-time Chart Visualization** - Interactive candlestick charts using lightweight-charts
- **AI-Powered Analysis** - Intelligent trade predictions with entry, stop loss, and take profit levels
- **Multiple Timeframes** - Support for 1min, 5min, 15min, 1h, 4h, and 1day intervals
- **Forex Pairs** - XAU/USD, GBP/JPY, GBP/USD, EUR/USD
- **Beautiful UI** - Clean monochromatic design with position-based color coding
- **Docker Support** - Easy deployment with Docker and docker-compose
- **User Preferences** - Automatically saves preferences and analysis history in localStorage
- **Analysis History** - Browse past analyses with modal view
- **SEO Optimized** - Comprehensive metadata, structured data, and social sharing support

## 🔍 SEO Features

The app is fully optimized for search engines and social sharing:

- **Comprehensive Metadata**: Title, description, keywords, and Open Graph tags
- **Structured Data**: JSON-LD schema for WebApplication
- **Sitemap**: Auto-generated sitemap at `/sitemap.xml`
- **Robots.txt**: Configured for proper crawling
- **PWA Support**: Web app manifest for installability
- **Social Media Cards**: Auto-generated Open Graph images for Twitter, Facebook, LinkedIn
- **Semantic HTML**: Proper heading hierarchy and ARIA labels
- **Mobile Optimized**: Responsive meta viewport settings

To customize for your domain, update the `baseUrl` in:
- `src/app/layout.tsx` (metadata.openGraph.url and alternates.canonical)
- `src/app/sitemap.ts` (baseUrl constant)

## 📋 Prerequisites

- **Docker & Docker Compose** (recommended)
  - OR **Node.js 20+** and **pnpm** for local development
- **Twelve Data API Key** - Get one at [twelvedata.com](https://twelvedata.com)

## 🐳 Quick Start with Docker (Recommended)

### 1. Clone and Setup Environment

```bash
# Create .env file
make env

# Edit .env and add your API key
# NEXT_PUBLIC_TWELVE_DATA_API_KEY=your_api_key_here
```

### 2. Start Development Server

```bash
# Start development server with hot-reload
make dev

# Or start in detached mode
make up
```

The app will be available at [http://localhost:3000](http://localhost:3000)

### 3. Other Docker Commands

```bash
# View logs
make logs

# Restart container
make restart

# Stop container
make down

# Build and run production
make prod-build
make prod-up

# Access container shell
make shell

# Clean everything
make clean
```

## 💻 Local Development (Without Docker)

### Install Dependencies

```bash
pnpm install
```

### Run Development Server

```bash
pnpm dev
```

### Build for Production

```bash
pnpm build
pnpm start
```

## 🛠️ Available Make Commands

Run `make help` to see all available commands:

| Command | Description |
|---------|-------------|
| `make dev` | Start development server with hot-reload |
| `make up` | Start development container (detached) |
| `make down` | Stop development container |
| `make restart` | Restart development container |
| `make logs` | View container logs |
| `make prod-build` | Build production Docker image |
| `make prod-up` | Start production container |
| `make prod-down` | Stop production container |
| `make install` | Install dependencies locally |
| `make build` | Build Next.js app locally |
| `make lint` | Run linter |
| `make clean` | Clean all build artifacts |
| `make shell` | Open shell in dev container |
| `make env` | Create .env from template |

## 📁 Project Structure

```
chart-analysis/
├── src/
│   ├── app/
│   │   ├── page.tsx           # Main application page
│   │   ├── actions.ts         # Server actions for AI analysis
│   │   ├── globals/
│   │   │   └── mocks/         # Mock data for testing
│   │   └── api/               # API routes
│   ├── components/
│   │   └── ui/                # Reusable UI components
│   └── lib/                   # Utility functions
├── public/                    # Static assets
├── Dockerfile                 # Production Docker configuration
├── Dockerfile.dev            # Development Docker configuration
├── docker-compose.yml        # Docker Compose configuration
├── Makefile                  # Build automation
└── package.json              # Dependencies
```

## 🎨 Technology Stack

- **Framework**: Next.js 16 (App Router)
- **UI Library**: Chakra UI v3
- **Charts**: Lightweight Charts
- **AI**: xAI Grok API
- **Package Manager**: pnpm
- **Containerization**: Docker & Docker Compose

## 🔧 Configuration

### Environment Variables

Create a `.env` or `.env.local` file:

```env
NEXT_PUBLIC_TWELVE_DATA_API_KEY=your_twelve_data_api_key
```

### Docker Configuration

- **Development**: Uses `Dockerfile.dev` with hot-reload and volume mounting
- **Production**: Uses multi-stage `Dockerfile` with optimized standalone build

## 🚢 Production Deployment

### Build Production Image

```bash
make prod-build
```

### Run Production Container

```bash
make prod-up
```

The production build is optimized with:
- Multi-stage Docker build
- Standalone output mode
- Non-root user for security
- Minimal image size

## 📝 Development Notes

- The app uses Server Actions for AI analysis
- Chart data is fetched from Twelve Data API
- Real-time chart updates with React hooks
- Monochromatic design with green (LONG) and red (SHORT) position indicators

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is private and not licensed for public use.
