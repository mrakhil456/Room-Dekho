# RoomDekho MongoDB setup

RoomDekho uses MongoDB through Mongoose.

## Local MongoDB with Docker

```bash
docker compose up -d mongodb
```

The default connection is:

```text
mongodb://127.0.0.1:27017/roomdekho
```

## Environment

Copy `backend/.env.example` to `backend/.env` and set a strong `JWT_SECRET`.

For MongoDB Atlas, replace `MONGODB_URI` with your Atlas connection string and allow the deployment IP/network in Atlas.

## Health check

`GET /api/health` reports both application and MongoDB state. It returns HTTP 200 when MongoDB is connected and 503 when the database is unavailable.

The React frontend calls this endpoint immediately on mount and every **5 minutes** thereafter. The interval is cleaned up when the app unmounts.
