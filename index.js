const inquirer = require("inquirer");
const cTable = require("console.table");
const fs = require("fs");
const path = require("path");
const mysql = require("mysql");




var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "password",
    database: "employee_db"
});


connection.connect(function (err) {
    if (err) throw err;
});

// Function to validate that the questions asked are answered
function validation(value) {
    if (value != "") {
        return true;
    } else {
        return "Please answer the question.";
    }
}

//Inquirer questions 
const introQuestion = [
    {
        type: "list",
        name: "intro",
        message: "What would you like to do?",
        choices: [
            "View all employees",
            "View all departments",
            "View all roles",
            "Add an employee",
            "Add a department",
            "Add an employee role",
            "Update employee role",
            "Exit application",
        ],
        validate: validation,
    },
];


// Question to trigger the add new employee flow
const addEmployeeQuestion = [
    {
        type: "input",
        name: "firstName",
        message: "Please enter employee's first name.",
        validate: validation,
    },
    {
        type: "input",
        name: "lastName",
        message: "Please enter employee's last name.",
        validate: validation,
    },
    {
        type: "list",
        name: "employeeRole",
        message: "Please select the employee's role.",
        choices: async function () {
            var employeeRole = [];
            var promiseWrapper = function () {
                return new Promise((resolve) => {
                    connection.query(`SELECT role.title FROM role`, function (
                        err,
                        res,
                        field
                    ) {
                        if (err) throw err;
                        for (var i = 0; i < res.length; i++) {
                            employeeRole.push(`${res[i].title}`);
                        }
                        resolve("resolved");
                    });
                });
            };
            await promiseWrapper();
            return employeeRole;
        },
    },
    {
        type: "list",
        name: "employeeManager",
        message: "Please select the employee's manager.",
        choices: async function () {
            var employeeManager = [];
            var promiseWrapper = function () {
                return new Promise((resolve) => {
                    connection.query(
                        `SELECT
						employee.id,
						CONCAT(employee.first_name, " ", employee.last_name) as manager
						FROM employee
						WHERE employee.manager_id IS NULL;`,
                        function (err, res, field) {
                            if (err) throw err;
                            for (var i = 0; i < res.length; i++) {
                                employeeManager.push(`${res[i].manager}`);
                            }
                            resolve("resolved");
                        }
                    );
                });
            };
            await promiseWrapper();
            return employeeManager;
        },
    },
];