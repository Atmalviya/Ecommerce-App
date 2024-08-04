# eCommerce App

## Description
This eCommerce application allows users to sign up, log in, view products, add products to their cart, and complete a checkout process. Admin users have additional privileges to manage the product listings.

## Features
- **User Registration & Login**: Users can sign up and log in to access their account.
- **Product Browsing**: Users can view all available products.
- **Cart Management**: Users can add products to their cart, view their cart, and remove items if needed.
- **Checkout Process**: Users can fill in their address and complete the checkout process.
- **Order Confirmation**: Users receive a confirmation email after a successful checkout. valid gmail required to receive mail.
- **Admin Privileges**: Admins can log in, view all products, and have the ability to add or delete products.

## Installation
1. Clone the repository:
    ```bash
    git clone https://github.com/Atmalviya/Ecommerce-App
    ```

3. Navigate to the project directory:
    ```bash
    cd ecommerce-app
    ```

#### PS:-
Thia repo contains two frontend client

1- client - is build using react and typeScript.

2-client2 - is build using react and javaScipt

4. Navigate to the client/clien2 directory:
    ```bash
    cd client / cd client2
    ```
    
5. Install the dependencies for client:
    ```bash
    npm install
    ```
6. Run client:
    ```bash
    npm run dev
    ```
7. Navigate to the server directory:
    ```bash
    cd ../server
    ```
8. Install the dependencies for client:
    ```bash
    npm install
    ```

9. Set up environment variables:
    - Create a `.env` file in the root directory and add your environment variables:
    ```env
    PORT=5000
    MONGO_URI=your_mongo_db_uri
    JWT_SECRET=your_jwt_secret
    EMAIL=your_email_host
    PASSWORD=your_email_password
    ```

9. Start the development server:
    ```bash
    npm run start
    ```

## Usage

### User

1. **Sign Up**: Navigate to the sign-up page and create an account.
2. **Log In**: Use your credentials to log in.
3. **Browse Products**: View the list of available products.
4. **Add to Cart**: Add desired products to your cart.
5. **View Cart**: Go to your cart to see the products you've added.
6. **Checkout**: Fill in your address and complete the checkout process.
7. **Confirmation Email**: Receive a confirmation email upon successful checkout.

### Admin

1. **Log In**: Navigate to the admin login page and log in with your admin credentials.
2. **Manage Products**: View all products. You can add new products or delete existing ones.

## API Endpoints

### Auth
- `POST /api/auth/signup` - Register a new user
- `POST /api/auth/login` - Log in an existing user

### Products
- `GET /api/products/all` - Get all products (User and Admin)
- `POST /api/productsadd` - Add a new product (Admin only)
- `DELETE /api/products/delete/:id` - Delete a product (Admin only)

### Cart
- `GET /api/cart/view` - Get user's cart
- `POST /api/cart/add` - Add a product to the cart
- `POST /api/cart/remove` - Remove a product from the cart
- `POST /api/cart/update-quantity` - Update product quantity in cart

### Orders
- `POST /api/cart/checkout` - Checkout the cart and sends the confirmation mail

## Technologies Used
- **Front-end**: React, Vite using JavaScript
- **Back-end**: Node.js, Express using typeScript
- **Database**: MongoDB
- **Authentication**: JWT
- **Email**: Nodemailer

## Deployment
This application is deployed on Vercel. You can access it at [https://ecommerce-app-jsx.vercel.app/](https://ecommerce-app-jsx.vercel.app/).



ps:- Github repository contains two client directory 

- client - This is built using React TypeScript

- client2- This is built using React JavaScript

React javaScipt is deployed for client side
