# Room Rental Backend

Backend API for the Room Rental Website built with Node.js, Express.js, and MongoDB.

## Installation

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the backend directory with the following variables:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/room-rental
JWT_SECRET=replace_with_a_random_secret_at_least_32_characters
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

4. Make sure MongoDB is running on your system.

For a separate production frontend and backend deployment, set `FRONTEND_URL` on
the backend to the exact frontend origin (scheme and host, no path). For example,
use `https://your-frontend.example.com`. Set the frontend build variable
`VITE_API_BASE_URL` to the backend origin (for example,
`https://your-backend.example.com`), without `/api`; the frontend appends `/api`
to API requests. If frontend and backend are deployed on the same origin, leave
`VITE_API_BASE_URL` empty.

## Running the Server

### Development mode (with auto-reload):
```bash
npm run dev
```

### Production mode:
```bash
npm start
```

The server will start on `http://localhost:5000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (requires auth)

### Rooms
- `GET /api/rooms` - Get all rooms
- `GET /api/rooms/:id` - Get room by ID
- `POST /api/rooms` - Create a new room (requires auth)
- `PUT /api/rooms/:id` - Update room (requires auth, landlord only)
- `DELETE /api/rooms/:id` - Delete room (requires auth, landlord only)
- `POST /api/rooms/:id/reviews` - Add review to room (requires auth)

### Users
- `GET /api/users/profile/me` - Get current user profile (requires auth)
- `PUT /api/users/profile/me` - Update user profile (requires auth)
- `GET /api/users/:id` - Get user by ID

## Authentication

Use JWT tokens for authenticated requests. Include the token in the Authorization header:
```
Authorization: Bearer <your_token>
```

## Database Models

### User
- name: String
- email: String (unique)
- password: String (hashed)
- role: String (tenant, landlord, admin)
- phone: String
- profileImage: String
- bio: String
- isVerified: Boolean

### Room
- title: String
- description: String
- price: Number
- location: Object (address, city, state, pincode, coordinates)
- amenities: Array
- images: Array
- bedrooms: Number
- bathrooms: Number
- furnishingType: String (furnished, semi-furnished, unfurnished)
- squareFeet: Number
- availability: Boolean
- landlord: ObjectId (User reference)
- rating: Number
- reviews: Array of review objects


## Admin login

RoomDekho provisions the admin account from backend environment variables when the server starts. This means the same admin account can be used locally and after deployment as long as the deployed backend has the same `ADMIN_EMAIL` and `ADMIN_PASSWORD` values and points to the same MongoDB database (or provisions the same credentials into its database).

Set these in `backend/.env` locally and in your deployment provider's backend environment settings:

```env
ADMIN_NAME=RoomDekho Admin
ADMIN_EMAIL=admin@roomdekho.com
ADMIN_PASSWORD=ChangeThisAdminPasswordBeforeDeployment123!
```

**Security:** do not commit the real admin password to Git. The value above is an example; replace it with a strong unique password before production deployment. The password is hashed by the User model before it is stored in MongoDB.

You can also manually provision/reset the account with:

```bash
npm run seed:admin
npm run reset:admin
```
