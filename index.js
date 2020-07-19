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
