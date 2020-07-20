
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

-- Insert the pre-populated data for departments table
INSERT INTO department (name) values ('Finance');
INSERT INTO department (name) values ('Engineering');
INSERT INTO department (name) values ('Sales');
INSERT INTO department (name) values ('Legal');

-- Insert the pre-populated role data for the role table
INSERT INTO role (title, salary, department_id) values ('Accountant',80000,1);
INSERT INTO role (title, salary, department_id) values ('Software Engineer',100000,2);
INSERT INTO role (title, salary, department_id) values ('Account Executive',50000,3);
INSERT INTO role (title, salary, department_id) values ('Lawyer',110000,4);

-- Insert the pre-populated data for the employee table
INSERT INTO employee (first_name, last_name, role_id) values ('John', 'Doe', 1);
INSERT INTO employee (first_name, last_name, role_id) values ('Jane', 'Doe', 1);
INSERT INTO employee (first_name, last_name, role_id) values ('Gabe', 'Lewis', 2);
INSERT INTO employee (first_name, last_name, role_id) values ('Erin', 'Hannon', 2);
INSERT INTO employee (first_name, last_name, role_id, manager_id) values ('Oscar', 'Nunez', 4, 1);
INSERT INTO employee (first_name, last_name, role_id, manager_id) values ('Kevin', 'Malone', 4, 1);
INSERT INTO employee (first_name, last_name, role_id, manager_id) values ('Jim', 'Halpert', 3, 2);
INSERT INTO employee (first_name, last_name, role_id, manager_id) values ('Pam', 'Halpert', 3, 2);

