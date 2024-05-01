# auth_resume_upload_system
This project consists of both frontend and backend components for a user authentication and management system.

## Frontend

The frontend is developed using Angular framework. It includes components for user signup and profile.

### Routing

The Angular application utilizes Angular Router for navigation. Below are the main routes:

- `/`: Landing page with signup form.
- `/profile`: Profile page for authenticated users.

### Installation

To install the frontend dependencies and run the application locally, follow these steps:

1. Navigate to the `frontend` directory.
2. Run `npm install` to install dependencies.
3. Run `ng serve` to start the development server.
4. Open `http://localhost:4200` in your browser to view the application.

## Backend

The backend is developed using Django. It provides REST API endpoints for user authentication, signup, login, logout, and user docs updation.

### Endpoints

- `POST /api/login`: Endpoint for user login.
- `GET /api/logout`: Endpoint for user logout.
- `POST /api/signup`: Endpoint for user signup.
- `GET /api/user`: Endpoint to retrieve user details.
- `PATCH /api/user`: Endpoint to update user password.
- `PUT /api/user/docs`: Endpoint to upload user documents (e.g., resume).
- `DELETE /api/user/docs`: Endpoint to delete user documents.

### Installation

To set up the backend server and run it locally, follow these steps:

1. Navigate to the `backend` directory.
2. Create a virtual environment (recommended).
3. Install dependencies from `requirements.txt` using `pip install -r requirements.txt`.
4. Run `python manage.py migrate` to apply migrations.
5. Run `python manage.py runserver 8000` to start the development server.
6. The backend server will be running at `http://localhost:8000`.

## Usage

1. Access the frontend application at `http://localhost:4200` in your browser.
2. Sign up for a new account or log in with existing credentials.
3. Navigate to the profile page to view, update or add resume.
4. Log out from the application when done.

