# Training Schedule Management System
https://fitme-hlbb.onrender.com/

A full-stack web application for appointment management with dedicated interfaces for trainers, trainees, and administrators. The platform allows users to schedule, manage, and track appointments efficiently while ensuring role-based access and functionality.

## Features

- Trainers can cancel and view assigned training sessions.
- Trainers can schedule vacations.
- Managers can view all training sessions and trainers' vacations.
- Managers can manage users and promote trainees to trainers.
- Role-based authentication and access control.
- Responsive UI for an intuitive user experience.

## Technologies Used

Node.js, Express, MongoDB, React, React Router

## Project Structure

- The backend is located in the `server` directory.
- API routes are defined in the `server/routes` directory.
- The frontend is located in the `client` directory.


## Installation & Setup
### Prerequisites
- Node.js installed
- MongoDB instance (local or cloud)

### Clone the repository
```sh
git clone https://github.com/shilat2132/fitMe.git
cd fitMe
```

### Install dependencies
#### Backend
```sh
cd server
npm install
```

#### Frontend
```sh
cd client
npm install
```


## Running the Application
### Start the backend server
```sh
cd server
npm start
```


### Start the frontend application
```sh
cd client
npm start
```

enter the link: http://localhost:5173 after the start commends


## Demo Credentials
### Admin
Email: admin@gmail.com
Password: admin2132

### Trainer
Email: mor@gmail.com
Password: trainer2132

### Trainee
Sign up with any email via the UI

## Environment Variables

Create a `.env` file in the `server` directory with the following variables:

```env
DB=<your-mongodb-uri>
JWT_COOKIE_EXPIRES_IN=<cookie-expiration-time>
JWT_EXPIRESIN=<jwt-expiration-time>
JWT_SECRET=<your-secret-key>
MAILTRAP_HOST=<mailtrap-smtp-host>
MAILTRAP_PASSWORD=<mailtrap-smtp-password>
MAILTRAP_PORT=<mailtrap-smtp-port>
MAILTRAP_USERNAME=<mailtrap-smtp-username>
NODE_ENV= development
```

- `DB`: Your MongoDB connection URI.
- `JWT_COOKIE_EXPIRES_IN`: The expiration time of the JWT cookie (e.g., `14` for 14 days).
- `JWT_EXPIRESIN`: The expiration time of the JWT token (e.g., `14d` for 14 days).
- `JWT_SECRET`: A secret key used for signing JSON Web Tokens (JWT).
- `MAILTRAP_HOST`: The Mailtrap SMTP host for email sending.
- `MAILTRAP_PASSWORD`: The Mailtrap SMTP password.
- `MAILTRAP_PORT`: The Mailtrap SMTP port.
- `MAILTRAP_USERNAME`: The Mailtrap SMTP username.
- `NODE_ENV`: The environment mode (usually `development` or `production`).
```


```
## License
This project is licensed under the MIT License.

```
