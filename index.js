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

// Question to trigger add new role flow
const addRoleQuestion = [
    {
        type: "input",
        name: "newRole",
        message: "Please enter the title of the new role.",
        validate: validation,
    },
    {
        type: "list",
        name: "roleDepartment",
        message: "Please select a department for this role.",
        choices: async function () {
            var departmentChocies = [];
            var promiseWrapper = function () {
                return new Promise((resolve) => {
                    connection.query(`SELECT department.name FROM department`, function (
                        err,
                        res,
                        field
                    ) {
                        if (err) throw err;
                        for (var i = 0; i < res.length; i++) {
                            departmentChocies.push(`${res[i].name}`);
                        }
                        resolve("resolved");
                    });
                });
            };
            await promiseWrapper();
            return departmentChocies;
        },
    },
    {
        type: "input",
        name: "salary",
        message: "Please enter the salary for this role.",
        validate: function (value) {
            var salary = parseInt(value);
            if (!salary || salary < 0) {
                return "Please enter a valid salary amount.";
            } else {
                return true;
            }
        },
    },
];

// Question to trigger add new department path
const addDepartmentQuestion = [
    {
        type: "input",
        name: "newDepartment",
        message: "Please enter the name of the new department.",
        validate: validation,
    },
];

// Question to trigger update employee pathway
const updateEmployeeRoleQuestion = [
    {
        type: "list",
        name: "updateRole",
        message: "Which role would you like to update?",
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
        type: "input",
        name: "updateTitle",
        message:
            "Please enter new title for this role. If no change needed, enter current title.",
        validate: validation,
    },
    {
        type: "input",
        name: "updateSalary",
        message:
            "Please enter new salary amount for this role. If no change needed, enter in current salary.",
        validate: function (value) {
            var salary = parseInt(value);
            if (!salary || salary < 0) {
                return "Please enter a valid salary amount.";
            } else {
                return true;
            }
        },
    },
    {
        type: "list",
        name: "updateDepartment",
        message:
            "Please select new department for this role. If no change needed, select current department.",
        choices: async function () {
            var departmentChocies = [];
            var promiseWrapper = function () {
                return new Promise((resolve) => {
                    connection.query(`SELECT department.name FROM department`, function (
                        err,
                        res,
                        field
                    ) {
                        if (err) throw err;
                        for (var i = 0; i < res.length; i++) {
                            departmentChocies.push(`${res[i].name}`);
                        }
                        resolve("resolved");
                    });
                });
            };
            await promiseWrapper();
            return departmentChocies;
        },
    },
];

