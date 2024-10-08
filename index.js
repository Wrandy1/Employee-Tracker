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
init();

function init() {
  inquirer
    .prompt([
      {
        type: "list",
        name: "input",
        message: "What would you like to do?",
        choices: [
          "View all departments",
          "View all roles",
          "View all employees",
          "Add a role",
          "Add an employee",
          "Add a department",
          "Update an employee role",
          "Exit",
        ],
      },
    ])
    .then(({ input }) => {
      if (input === "View all departments") {
        viewAllDepartments();
      } else if (input === "View all roles") {
        viewAllRoles();
      } else if (input === "View all employees") {
        viewAllEmployees();
      } else if (input === "Add department") {
        addDepartment();
      } else if (input === "Add role") {
        addRole();
      } else if (input === "Add employee") {
        addEmployee();
      } else if (input === "Update an employee role") {
        updateEmployee();
      } else if (input === "Exit")
        return console.log(`You've quit your session.`);
    });
}

function viewAllDepartments() {
  pool.query(`SELECT * FROM departments;`, (err, { rows }) => {
    console.table(rows);
    init();
  });
}
function viewAllRoles() {
  pool.query(`SELECT * FROM roles;`, (err, { rows }) => {
    console.table(rows);
    init();
  });
}
function viewAllEmployees() {
  pool.query(`SELECT * FROM employees;`, (err, { rows }) => {
    console.table(rows);
    init();
  });
}

