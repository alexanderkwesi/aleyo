# Aleyo AI Website Builder — Backend API

FastAPI backend for the Aleyo AI Website Builder platform. Provides authentication, project management, design templates, credit transactions, integrations, and real-time WebSocket support.

## Requirements

- Python 3.14+
- SQLite (default) or compatible SQL database

## Installation

```bash
pip install -r requirements.txt
```

## Running Locally

```bash
uvicorn app:app --host 127.0.0.1 --port 8000 --reload
```

## Environment Variables

| Variable | Description | Default |
|---|---|---|
| `SECRET_KEY` | JWT signing secret | `your-secret-key-change-in-production` |
| `DATABASE_URL` | SQLAlchemy database URL | SQLite |

## API Endpoints

### Auth
- `POST /api/auth/register` — Register a new user
- `POST /api/auth/login` — Login and receive JWT
- `POST /api/auth/forgot-password` — Request password reset
- `POST /api/auth/reset-password` — Reset password with token
- `GET /api/auth/me` — Get current user profile

### Projects
- `GET /api/projects` — List user projects
- `POST /api/projects` — Create a new project
- `GET /api/projects/{id}` — Get project by ID
- `PUT /api/projects/{id}` — Update a project
- `DELETE /api/projects/{id}` — Delete a project
- `POST /api/projects/{id}/publish` — Publish a project

### Designs
- `GET /api/designs` — List all design templates
- `GET /api/designs/{id}` — Get design template by ID
- `POST /api/preview` — Preview merged designs

### Credits & Integrations
- `POST /api/credits/purchase` — Purchase credits
- `POST /api/integrations` — Add an integration
- `GET /api/integrations` — List integrations

### Analytics
- `GET /api/analytics/usage` — Get usage analytics

### Health
- `GET /api/health` — Health check

## WebSocket

Connect to `/ws/{user_id}` for real-time updates. Supported message types:

- `voice_command` — Process a voice command
- `selection` — Apply a UI selection
- `merge_designs` — Merge multiple design templates

## License

MIT
