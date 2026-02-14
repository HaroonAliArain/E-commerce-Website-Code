# MERN E-commerce Website

A MERN-stack E-commerce web application built with the MERN stack (MongoDB, Express.js, React, Node.js). This project features a complete shopping experience with user authentication, product management, cart functionality, secure Stripe payments, and a dedicated admin dashboard for managing products, orders, and users.


## Key Features

### User Features
- User registration and login with JWT authentication
- Browse products with search, filter, and pagination
- Add products to cart and manage quantities
- Secure checkout with Stripe payment integration
- Cash on Delivery option
- View order history and order status
- User profile management

### Admin Features
- Admin dashboard with analytics overview
- Product management (CRUD operations)
- Order management with status updates
- User management
- Image upload via Cloudinary
- Email notifications for order confirmation

---

## Tech Stack

### Frontend
- React 18
- Vite
- Redux Toolkit (State Management)
- React Router DOM
- Tailwind CSS
- Axios
- Stripe.js

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT Authentication
- Multer (File Upload)
- Cloudinary (Image Storage)
- Nodemailer (Email Service)
- Stripe API

---

## Project Structure

```
E-commerce Website/
├── client/
│   └── E-commerce/
│       ├── src/
│       │   ├── components/     # Reusable UI components
│       │   ├── features/       # Redux slices
│       │   ├── pages/          # User and Admin pages
│       │   ├── services/       # API configuration
│       │   └── App.jsx
│       └── package.json
│
└── server/
    ├── controllers/            # Route handlers
    ├── models/                 # Mongoose schemas
    ├── routes/                 # API routes
    ├── middlewares/            # Auth and error handlers
    ├── utils/                  # Helper functions
    └── server.js
```

---

## Installation & Setup

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or Atlas)
- Stripe Account test mode
- Cloudinary Account

### Environment Variables

**Server (.env)**
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
STRIPE_SECRET_KEY=your_stripe_secret_key
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
EMAIL_USER=your_email
EMAIL_PASS=your_email_password
```

**Client (.env)**
```env
VITE_API_URL=http://localhost:5000
VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
```

---

## How to Run

### Backend
```bash
cd server
npm install
npm run dev
```

### Frontend
```bash
cd client/E-commerce
npm install
npm run dev
```

The application will be available at:
- Frontend: `http://localhost:5173`
- Backend: `http://localhost:5000`

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | User registration |
| POST | /api/auth/login | User login |
| GET | /api/products | Get all products |
| POST | /api/orders | Create new order |
| PUT | /api/orders/:id/pay | Update payment status |
| GET | /api/orders/myorders | Get user orders |

---

## Future Improvements

- Product reviews
- Wishlist functionality
- Advanced product filtering
- Order tracking with real-time updates
- Multiple payment gateway options
- Email verification on registration
- Password reset functionality
- Inventory management system


