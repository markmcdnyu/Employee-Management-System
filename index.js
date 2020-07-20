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

//NEED to insert the validation function, so that questions aren't left unanswered
function validation(value) {
    if (value != "") {
        return true;
    } else {
        return "Please answer the question. Cannot leave this section blank.";
    }
}

//NEED to start with inquirer questions for inital opening of the application
const introQuestion = [
    {
        type: "list",
        name: "intro",
        message: "Where would you like to begin?",
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


// NEED question to fire the 'add new employee' pathway
const addEmployeeQuestion = [
    {
        type: "input",
        name: "firstName",
        message: "Please enter the employee's first name.",
        validate: validation,
    },
    {
        type: "input",
        name: "lastName",
        message: "Please enter the employee's last name.",
        validate: validation,
    },
    {
        type: "list",
        name: "employeeRole",
        message: "Please select the employee's role.",
        choices: async function () {
            var employeeRole = [];
            var promiseFunction = function () {
                return new Promise((resolve) => {
                    connection.query(`SELECT role.title FROM role`, function (err, res, field) {
                        if (err) throw err;
                        for (var i = 0; i < res.length; i++) {
                            employeeRole.push(`${res[i].title}`);
                        }
                        resolve("resolved");
                    });
                });
            };
            await promiseFunction();
            return employeeRole;
        },
    },
    {
        type: "list",
        name: "employeeManager",
        message: "Please select the employee's manager.",
        choices: async function () {
            var employeeManager = [];
            var promiseFunction = function () {
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
            await promiseFunction();
            return employeeManager;
        },
    },
];

//NEED questions to fire to add new role pathway
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
            var promiseFunction = function () {
                return new Promise((resolve) => {
                    connection.query(`SELECT department.name FROM department`, function (err, res, field) {
                        if (err) throw err;
                        for (var i = 0; i < res.length; i++) {
                            departmentChocies.push(`${res[i].name}`);
                        }
                        resolve("resolved");
                    });
                });
            };
            await promiseFunction();
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

//NEED questions to fire to add a new department path
const addDepartmentQuestion = [
    {
        type: "input",
        name: "newDepartment",
        message: "Please enter the name of the new department.",
        validate: validation,
    },
];

//NEED questions to trigger and update for the employee pathway
const updateEmployeeRoleQuestion = [
    {
        type: "list",
        name: "updateRole",
        message: "Which role would you like to update?",
        choices: async function () {
            var employeeRole = [];
            var promiseFunction = function () {
                return new Promise((resolve) => {
                    connection.query(`SELECT role.title FROM role`, function (err, res, field) {
                        if (err) throw err;
                        for (var i = 0; i < res.length; i++) {
                            employeeRole.push(`${res[i].title}`);
                        }
                        resolve("resolved");
                    });
                });
            };
            await promiseFunction();
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
            var promiseFunction = function () {
                return new Promise((resolve) => {
                    connection.query(`SELECT department.name FROM department`, function (err, res, field) {
                        if (err) throw err;
                        for (var i = 0; i < res.length; i++) {
                            departmentChocies.push(`${res[i].name}`);
                        }
                        resolve("resolved");
                    });
                });
            };
            await promiseFunction();
            return departmentChocies;
        },
    },
];

//NEED a function to view all employees
function viewAllEmployees() {
    connection.query(
        `SELECT employee.id, employee.first_name, employee.last_name, role.title,
		department.name AS department,role.salary,CONCAT(a.first_name, " ", a.last_name) AS manager
		FROM employee
		LEFT JOIN role ON employee.role_id = role.id
		LEFT JOIN department ON role.id = department.id
		LEFT JOIN employee a ON a.id = employee.manager_id;`,
        function (err, res, field) {
            if (err) throw err;
            console.table(res);
            inquirer.prompt(introQuestion).then(answerChoices);
        }
    );
}

// NEED a function to view all departments
function viewAllDepartments() {
    connection.query("SELECT * FROM department;", function (err, res, field) {
        if (err) throw err;
        console.table(res);
        inquirer.prompt(introQuestion).then(answerChoices);
    });
}

// NEED a function to view all roles
function viewAllRoles() {
    connection.query("SELECT * FROM role;", function (err, res, field) {
        if (err) throw err;
        console.table(res);
        inquirer.prompt(introQuestion).then(answerChoices);
    });
}

//NEED a function to add a new employee
function addNewEmployee() {
    inquirer.prompt(addEmployeeQuestion).then(async function (answers) {
        var fName = answers.firstName;
        var lName = answers.lastName;
        var selectedRole = answers.employeeRole;
        var selectedManager = answers.employeeManager;

        //NEED to pull out the role id for a given role title using async await
        var promiseFunction1 = function () {
            return new Promise((resolve) => {
                connection.query(
                    `SELECT role.id FROM role WHERE role.title = '${selectedRole}';`,
                    function (err, res, field) {
                        if (err) throw err;
                        resolve(res[0].id);
                    }
                );
            });
        };
        // NEED a roleId variable that will be applied when adding an employee
        var roleId = await promiseFunction1();

        //NEED variable to pull out the manager id for a given manager
        var promiseFunction2 = function () {
            return new Promise((resolve) => {
                connection.query(
                    `SELECT employee.id FROM employee
					WHERE CONCAT(employee.first_name, " ", employee.last_name) = '${selectedManager}';`,
                    function (err, res, field) {
                        if (err) throw err;
                        resolve(res[0].id);
                    }
                );
            });
        };
        //NEED a managerId variable that will be applies when adding an employee
        var managerId = await promiseFunction2();

        //NEED connection query to insert new employee input into employee table
        connection.query(
            `INSERT INTO employee (first_name, last_name, role_id, manager_id) 
			VALUES('${fName}', '${lName}', ${roleId}, ${managerId});`,
            function (err, res, field) {
                if (err) throw err;
                inquirer.prompt(introQuestion).then(answerChoices);
            }
        );
    });
}

// NEED a function to add a new department
function addNewDepartment() {
    inquirer.prompt(addDepartmentQuestion).then(async function (answers) {

        //NEED connection query to insert new department into the department table
        connection.query(
            `INSERT INTO department (name) VALUES('${answers.newDepartment}');`,
            function (err, res, field) {
                if (err) throw err;
                inquirer.prompt(introQuestion).then(answerChoices);
            }
        );
    });
}

//NEED a function to add a new employee role
function addNewEmployeeRole() {
    inquirer.prompt(addRoleQuestion).then(async function (answers) {
        var deptName = answers.roleDepartment;
        var salaryEntered = answers.salary;
        var titleEntered = answers.newRole;

        //NEED to pull out the department id for a given department title using async await
        var promiseFunction1 = function () {
            return new Promise((resolve) => {
                connection.query(
                    `SELECT department.id FROM department WHERE department.name = '${deptName}';`,
                    function (err, res, field) {
                        if (err) throw err;
                        resolve(res[0].id);
                    }
                );
            });
        };
        var departmentID = await promiseFunction1();

        // NEED a connection query that will add new employee role
        connection.query(
            `INSERT INTO role (title, salary, department_id) 
			VALUES('${titleEntered}', ${salaryEntered}, ${departmentID});`,
            function (err, res, field) {
                if (err) throw err;
                inquirer.prompt(introQuestion).then(answerChoices);
            }
        );
    });
}

// NEED a function to update an existing employee role
function updateEmployeeRole() {
    inquirer.prompt(updateEmployeeRoleQuestion).then(async function (answers) {
        var selectedUpdateRole = answers.updateRole;
        var selectedUpdateTitle = answers.updateTitle;
        var selectedUpdateSalary = answers.updateSalary;
        var selectedUpdateDepartment = answers.updateDepartment;

        //NEED to pull out the role id for a given role title using async await
        var promiseFunction1 = function () {
            return new Promise((resolve) => {
                connection.query(
                    `SELECT role.id FROM role WHERE role.title = '${selectedUpdateRole}';`,
                    function (err, res, field) {
                        if (err) throw err;
                        resolve(res[0].id);
                    }
                );
            });
        };
        var roleID = await promiseFunction1();

        //NEED to pull out the department id for a certain department title
        var promiseFunction2 = function () {
            return new Promise((resolve) => {
                connection.query(
                    `SELECT department.id FROM department WHERE department.name = '${selectedUpdateDepartment}';`,
                    function (err, res, field) {
                        if (err) throw err;
                        resolve(res[0].id);
                    }
                );
            });
        };
        var departmentID = await promiseFunction2();

        // NEED connection query that will update an employee role from a user's input 
        connection.query(
            `UPDATE role
			SET role.title = '${selectedUpdateTitle}', role.salary = ${selectedUpdateSalary}, role.department_id = ${departmentID}
			WHERE role.id = ${roleID};`,
            function (err, res, field) {
                if (err) throw err;
                inquirer.prompt(introQuestion).then(answerChoices);
            }
        );
    });
}

// NEED a function to trigger the logic based on a user's answer choices 
// Will try a large if/else because the user is not inputting the answer choices by text, rather inquirer arrow keys

function answerChoices(answer) {
    if (answer.intro === "View all employees") {
        viewAllEmployees();
    } else if (answer.intro === "View all departments") {
        viewAllDepartments();
    } else if (answer.intro === "View all roles") {
        viewAllRoles();
    } else if (answer.intro === "Add an employee") {
        addNewEmployee();
    } else if (answer.intro === "Add a department") {
        addNewDepartment();
    } else if (answer.intro === "Add an employee role") {
        addNewEmployeeRole();
    } else if (answer.intro === "Update employee role") {
        updateEmployeeRole();
    } else if (answer.intro === "Exit application") {
        connection.end();
        return;
    }
}

// NEED the inquirer prompt to start the intro questions
inquirer.prompt(introQuestion).then(answerChoices);
