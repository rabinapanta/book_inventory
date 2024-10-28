Instructions for Setting Up and Running the project:

Prerequisites

Node.js: Ensure you have Node.js installed. 
MySQL: Make sure MySQL is installed and running.
Git: ensure Git is installed

Project Setup Instructions:

1.Clone the Repository

git clone <https://github.com/rabinapanta/book_inventory>
cd book_inventory

2.Navigate to Your Project Directory

3.Install Dependencies:
Run the following command to install required packages:
               npm install

4.Set Up the MySQL Database:
- Log in to MySQL: mysql -u root -p

-Create a new database for your project:
      CREATE DATABASE BookInventoryDB;

- Switch to the newly created database:
      USE BookInventoryDB;

- Create the necessary table using the scripts provided in backup.sql file in the project folder.

- Configure Database Connection:
    Open your routes.js where the database connection is made and update the connection settings as necessary:
    
    const connection = mysql.createConnection({
    host: 'localhost',
    user: 'newuser', // your MySQL username
    password: 'your_password', // your MySQL password
    database: 'BookInventoryDB'
});


5. Run the Application:
      node server.js

6. Access the application:
    http://localhost:3000