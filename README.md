# Todo App

A todo application built with Node.js, Express, and MongoDB.

## Features

- User registration and login
- Create, read, update, and delete todos
- Set due dates for todos
- Mark todos as completed
- Edit user profile (name, email, password)
- Email notifications for approaching due dates
- Forgot password functionality

## Technologies Used

- Node.js
- Express
- MongoDB
- JSON Web Tokens (JWT) for authentication
- SendGrid/Nodemailer for email notifications

## Getting Started

### Prerequisites

- Node.js and npm installed on your machine
- MongoDB installed and running locally or accessible remotely

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/todo-app.git
   ```

2. Navigate to the project directory:

   ```bash
   cd todo-app-backend
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

4. Set up environment variables:

   - Create a `.env` file in the root directory.
   - Define the following variables:

     ```plaintext
     PORT=3000
     MONGODB_URI=mongodb://localhost:27017/todo-app
     JWT_SECRET=your_jwt_secret
     SENDGRID_API_KEY=your_sendgrid_api_key
     ```

5. Start the server:

   ```bash
   npm start
   ```

6. Access the application at `http://localhost:3000` in your browser.

## API Endpoints

- **User Authentication**:

  - `POST /api/auth/register`: Register a new user.
  - `POST /api/auth/login`: Login an existing user.
  - `POST /api/auth/forgot_password`: Send reset password email.
  - `POST /api/auth/reset_password`: Reset user password.

- **Todos**:

  - `POST /api/todos`: Create a new todo.
  - `GET /api/todos`: Get all todos.
  - `GET /api/todos/:todoId`: Get a single todo by ID.
  - `PUT /api/todos/:todoId`: Update a todo.
  - `DELETE /api/todos/:todoId`: Delete a todo.

- **Profile**:
  - `PUT /api/profile`: Update user profile.

## Contributors

- [Your Name](https://github.com/prince4040)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
