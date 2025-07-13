# Personal Task Manager (Node.js SSR Project)

A full-stack web application built with Node.js and Express, designed as a personal task management system. This project is implemented using a **Server-Side Rendering (SSR)** architecture with EJS for templating, focusing on a secure, multi-user environment with role-based access control.

---

## Features

-   **Secure User Authentication**: JWT-based authentication with `httpOnly` cookies.
-   **Role-Based Access Control**: Clear distinction between `admin` and `user` roles. Admins can manage all users.
-   **Full CRUD Functionality**:
    -   **Users**: Admins can view, edit, and delete all user accounts.
    -   **Categories**: Users can create, edit, and delete their own personal categories.
    -   **Tasks**: Users can create, delete, and toggle the completion status of their tasks.
-   **Advanced Task Filtering & Pagination**:
    -   Filter tasks by completion status (`all`, `completed`, `pending`).
    -   Filter tasks by user-defined categories.
    -   Paginated task list displaying 10 items per page to handle large datasets efficiently.
-   **Responsive UI**: A clean, modern, and fully responsive design that works seamlessly on desktop and mobile devices.

---

## Tech Stack

-   **Backend**: Node.js, Express.js
-   **Templating (SSR)**: EJS (Embedded JavaScript)
-   **Database**: MySQL (using `mysql2` driver)
-   **Authentication**: JSON Web Tokens (`jsonwebtoken`), MD5 (as per project requirements)
-   **Development**: `nodemon` for live server reloading, `dotenv` for environment variable management.

---

## Getting Started

### Prerequisites

-   Node.js (v14 or higher)
-   MySQL Server

### Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/ZionAmar/my_tasks_app](https://github.com/ZionAmar/my_tasks_app)
    cd YOUR_REPOSITORY
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up the database:**
    -   Create a new MySQL database.
    -   Import the table structure from the provided `dump.sql` file or run the `CREATE TABLE` scripts manually.

4.  **Configure environment variables:**
    -   Create a `.env` file in the root directory.
    -   Add the following configuration and update with your credentials:
    ```env
    # Server
    PORT=3000

    # Database
    DB_HOST=localhost
    DB_USER=root
    DB_PASSWORD=your_password
    DB_NAME=your_database_name

    # Security
    JWT_SECRET=your_jwt_secret_key
    MD5_PEPPER=your_md5_secret_pepper
    ```

5.  **Run the application:**
    ```bash
    npm start
    ```
    The application will be available at `http://localhost:3000`.

