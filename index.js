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

function init () {
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
      } else if (input === "Add a department") {
        addDepartment();
      } else if (input === "Add a role") {
        addRole();
      } else if (input === "Add an employee") {
        addEmployee();
      } else if (input === "Update an employee role") {
        updateEmployee();
      } else if (input === "Exit")
        return console.log(`You've quit your session.`);
    });
}

const viewAllDepartments = async () => {
  try {
      const result = await pool.query(`
          SELECT id, department_name 
          FROM departments
      `);

      console.table(result.rows);
      init();

  } catch (error) {
      console.log(error)
  }
}
const viewAllRoles = async () => {
  try {
      const result = await pool.query(`
          SELECT title, id, department_id, salary
          FROM roles
      `);

      console.table(result.rows);
      init();

  } catch (error) {
      console.log(error);
  }
};
const viewAllEmployees = async () => {
  try {
      const result = await pool.query(`
          SELECT 
              e.id 
                  AS employees_id, 
              e.first_name, 
              e.last_name, 
              r.title 
                  AS title, 
              d.department_name 
                  AS department_id, 
              r.salary, 
              COALESCE(
                  CONCAT(m.first_name, ' ', m.last_name), 'None') AS manager
          FROM 
              employees AS e
          JOIN 
              roles AS r ON e.role_id = r.id
          JOIN
              departments AS d ON r.department_id = d.id
          LEFT JOIN
              employees AS m ON e.manager_id = m.id;
      `);

      console.table(result.rows);
      init();

  } catch (error) {
      console.log(error);
  }
};

const addDepartment = async () => {
  try {
      const answer = await inquirer.prompt(
          [
              {
                  type: 'input',
                  name: 'departmentName',
                  message: 'What is the name of the department you wish to add?',
                  validate: input => input ? true : "Invalid input. Please try again."
              }
          ]
      );
      const result = await pool.query(`
          INSERT INTO departments (department_name)
          VALUES ('${answer.departmentName}')
          RETURNING id, department_name
          `);

      console.log('New Department added.');
      init();
  } catch (error) {
      console.log(error);
  }
};

const addRole = async () => {
  try {
      const departmentsQuery = await pool.query(`
          SELECT id, department_name
          FROM departments
          `);
      const departments = departmentsQuery.rows;
      const departmentSelection = departments.map(department => ({
          name: department.department_name,
          value: department.id
      }));

      const answer = await inquirer.prompt(
          [
              {
                  type: 'input',
                  name: 'roleTitle',
                  message: 'What is the name of the role you wish to add?',
                  validate: input => input ? true : "Invalid input. Please try again."
              },
              {
                  type: 'input',
                  name: 'roleSalary',
                  message: "What is the role's salary",
                  validate: input => !isNaN(input) ? true : 'Invalid input. Please enter an integer.'
              },
              {
                  type: 'list',
                  name: 'departmentId',
                  message: 'Select the department this role belongs to?',
                  choices: departmentSelection
              }
          ]
      );

      const result = await pool.query(`
          INSERT INTO roles (title, salary, department_id)
          VALUES ($1, $2, $3)
          RETURNING id, title, salary, department_id
          `, [answer.roleTitle, answer.roleSalary, answer.departmentId]);

      console.log('New Role added.');
      employeeTrackerMenu();
  } catch (error) {
      console.log(error);
  }
};