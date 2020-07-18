
-- Drops the employee_db if it exists  --
DROP DATABASE IF EXISTS employee_db;

-- Creates the "employee_db" database --
CREATE DATABASE employee_db;

-- Ensures that the query that follows will use employee_db --
USE employee_db;

-- Creates the table "department" within employee_db --
CREATE TABLE department (
  id INTEGER(10) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(30) NOT NULL
);

-- Creates the table "role" within employee_db --
CREATE TABLE role (
    id INTEGER(10) NOT NULL AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(30) NOT NULL,
    salary DECIMAL(10,2) NOT NULL,
    department_id INTEGER (10) NOT NULL,
    FOREIGN KEY (department_id) REFERENCES department(id) ON DELETE CASCADE
);
-- On delete cascade ?  memory leaks
-- Creates the table "employee" within employee_db --
CREATE TABLE employee (
    id INTEGER(10) NOT NULL AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    role_id INTEGER (10),
    FOREIGN KEY (role_id) REFERENCES role(id) ON DELETE CASCADE,
    manager_id INTEGER(10),
    FOREIGN KEY (manager_id) REFERENCES employee(id)
);