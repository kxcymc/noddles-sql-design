# Project Deployment Guide

This project uses MySQL database and is integrated with a Node.js backend. Below are the steps to configure the database and the frontend page.

## Database Configuration

1. **Initialize the Database**  
   Run the following SQL statements in MySQL to create the database, user, and set the appropriate permissions:

   ```sql
   -- First, create a database using the main user
   CREATE DATABASE restaurant;

   -- Create the user test001 and set the password
   CREATE USER 'test001'@'localhost' IDENTIFIED BY '123456';

   -- Grant all privileges to user test001 on the restaurant database
   GRANT ALL PRIVILEGES ON restaurant.* TO 'test001'@'localhost';

   -- Refresh privileges to apply the changes
   FLUSH PRIVILEGES;
   
   -- Remember to delete the user once done
   -- DROP USER 'test001'@'localhost';
   ```

2. **Set up Database Tables**  
   After logging in as the `test001` user, execute the entire `settings.sql` file.

3. **Configure `.env` File**  
   Create a `.env` file in the root directory of the project and add the following content:

   ```
   DB_HOST=localhost
   DB_USER=test001
   DB_PASSWORD=123456
   DB_NAME=restaurant
   PORT=8080
   ```

## Backend Configuration

1. **Install Dependencies and Start the Server**

   Make sure you have installed [Node.js](https://nodejs.org/) and [npm](https://npmjs.com/). Run the following steps in your terminal:

   - Navigate to the project directory:
     ```bash
     cd /path/to/project
     ```

   - Install project dependencies:
     ```bash
     npm i
     ```

   - Start the server:
     ```bash
     node server.js
     ```

   The backend server will now be running and listening on `localhost:3000`.

2. **Start the Frontend Page**

   Open a new terminal window, navigate to the project directory, and install `http-server`:

   ```bash
   npm install -g http-server
   ```

   Then, start the frontend page:

   ```bash
   http-server
   ```

   If there are no errors, you should be able to access the frontend at `localhost:8080` (the port number may vary depending on your actual configuration).

## Cleanup Operations

1. **Delete Database and Tables**

   Run the following command to delete the database and tables:

   ```bash
   DROP DATABASE restaurant;
   ```

2. **Clear Browser Cache**

   Go to your browser settings and clear the cache data for `localhost:8080`.

3. **Uninstall Dependencies**

   Uninstall `http-server`:

   ```bash
   npm uninstall -g http-server
   ```

4. **Uninstall Node.js and npm**

   Depending on your operating system, uninstall Node.js and npm (Windows users can uninstall from the Control Panel).

## Summary

By following the steps above, you should be able to successfully install and run this project. If you encounter any issues, feel free to open an issue or submit a pull request!
