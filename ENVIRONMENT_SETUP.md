# Environment Setup

## Server Environment Variables

Create a `.env` file in the `server/` directory with the following variables:

```bash
# Server Configuration
PORT=3040

# Database Configuration
MONGO_URI=your_mongodb_connection_string

# Authentication
AUTH_PASSWORD=your_auth_password

# WhatsApp Integration
WHATSAPP_URL=your_whatsapp_api_url

# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key
OPENAI_MODEL=gpt-4o-mini
```

## Client Environment Variables

Create a `.env` file in the `client/` directory with the following variables:

```bash
# Development Server Configuration
VITE_DEV_SERVER_PORT=3039

# API Configuration
VITE_API_BASE_URL=http://localhost:3040
VITE_API_PASSWORD=your_auth_password

# Supabase Configuration (if used)
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Port Configuration

- **Server**: Runs on port 3040 (configured via `PORT` environment variable)
- **Client**: Runs on port 3039 (configured via `VITE_DEV_SERVER_PORT` environment variable)
- **API Proxy**: Client proxies `/api/*` requests to the server URL (configured via `VITE_API_BASE_URL`)

## Default Values

If environment variables are not set, the application will use these defaults:
- Server port: 3040
- Client port: 3039
- API base URL: http://localhost:3040

## Running the Applications

1. Set up your `.env` files in both `server/` and `client/` directories
2. Start the server: `cd server && npm run dev`
3. Start the client: `cd client && npm run dev`

The applications will automatically use the ports specified in your environment variables, or fall back to the defaults if not specified. 