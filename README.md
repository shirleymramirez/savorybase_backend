# Savorybase Backend

RESTful Food CMS backend built with Node.js, Express, MongoDB, Mongoose, JWT auth, Zod validation, and Multer-based image uploads.

## Project Structure

```text
savorybase_backend/
├── server.js
├── package.json
├── .env.example
├── uploads/
│   └── .gitkeep
└── src/
    ├── app.js
    ├── config/
    │   ├── db.js
    │   └── env.js
    ├── controllers/
    │   ├── authController.js
    │   └── foodController.js
    ├── middleware/
    │   ├── asyncHandler.js
    │   ├── authMiddleware.js
    │   ├── errorMiddleware.js
    │   ├── uploadMiddleware.js
    │   └── validateRequest.js
    ├── models/
    │   └── FoodItem.js
    ├── routes/
    │   ├── authRoutes.js
    │   └── foodRoutes.js
    ├── utils/
    │   ├── apiResponse.js
    │   ├── buildFileUrl.js
    │   └── signToken.js
    └── validators/
        ├── authValidator.js
        └── foodValidator.js
```

## Setup

1. Install dependencies:

```bash
npm install
```

2. Copy environment variables:

```bash
cp .env.example .env
```

3. Update `.env` with your MongoDB URI, JWT secret, admin credentials, and allowed frontend URL.

4. Start the server:

```bash
npm run dev
```

## Environment Variables

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/savorybase
JWT_SECRET=replace-with-a-long-random-secret
JWT_EXPIRES_IN=1d
ADMIN_USERNAME=admin
ADMIN_PASSWORD=change-me
FRONTEND_URL=http://localhost:3000
```

`FRONTEND_URL` can be a comma-separated list for multiple frontend origins.

## API Endpoints

### Auth

- `POST /api/auth/login`

```json
{
  "username": "admin",
  "password": "change-me"
}
```

### Foods

- `GET /api/foods`
- `POST /api/foods` (admin JWT required)
- `PUT /api/foods/:id` (admin JWT required)
- `DELETE /api/foods/:id` (admin JWT required)

For `POST` and `PUT`, send either:

- `multipart/form-data` with an `image` file field, or
- JSON / form fields with a valid `imageUrl`

Food fields:

```json
{
  "name": "Truffle Pasta",
  "description": "Fresh pasta with truffle cream sauce",
  "price": 18.5,
  "category": "Main",
  "imageUrl": "https://example.com/images/truffle-pasta.jpg"
}
```

Allowed categories:

- `Appetizer`
- `Main`
- `Dessert`
- `Beverage`

## Response Format

Successful responses:

```json
{
  "success": true,
  "message": "Food items fetched successfully",
  "data": []
}
```

Error responses:

```json
{
  "success": false,
  "message": "Validation failed",
  "error": []
}
```
