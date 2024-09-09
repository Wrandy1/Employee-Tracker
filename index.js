const inquirer = require("inquirer");
const { Pool } = require("pg");

const pool = new Pool(
  {
    user: "postgres",
    password: "Jetthedog1!",
    host: "localhost",
    database: "employee_db",
  },
  console.log("Connected to employee_db")
);

pool.connect();

const questions = [
  {
    type: "list",
    name: "input",
    message: "What would you like to do?",
    choices: [
      "View all departments",
      "View all roles",
      "Add a role",
      "View all employees",
      "Add an employee",
      "Update an employee role",
      "View All Departments",
      "Add a department",

      "Exit",
    ],
  },
];


