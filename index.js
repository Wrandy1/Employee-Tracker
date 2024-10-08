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
    console.log(error);
  }
};
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
    const answer = await inquirer.prompt([
      {
        type: "input",
        name: "departmentName",
        message: "What is the name of the department you wish to add?",
        validate: (input) =>
          input ? true : "Invalid input. Please try again.",
      },
    ]);
    const result = await pool.query(`
          INSERT INTO departments (department_name)
          VALUES ('${answer.departmentName}')
          RETURNING id, department_name
          `);

    console.log("New Department added.");
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
    const departmentSelection = departments.map((department) => ({
      name: department.department_name,
      value: department.id,
    }));

    const answer = await inquirer.prompt([
      {
        type: "input",
        name: "roleTitle",
        message: "What is the name of the role you wish to add?",
        validate: (input) =>
          input ? true : "Invalid input. Please try again.",
      },
      {
        type: "input",
        name: "roleSalary",
        message: "What is the role's salary",
        validate: (input) =>
          !isNaN(input) ? true : "Invalid input. Please enter an integer.",
      },
      {
        type: "list",
        name: "departmentId",
        message: "Select the department this role belongs to?",
        choices: departmentSelection,
      },
    ]);

    const result = await pool.query(
      `
          INSERT INTO roles (title, salary, department_id)
          VALUES ($1, $2, $3)
          RETURNING id, title, salary, department_id
          `,
      [answer.roleTitle, answer.roleSalary, answer.departmentId]
    );

    console.log("New Role added.");
    init();
  } catch (error) {
    console.log(error);
  }
};
const addEmployee = async () => {
  try {
    const rolesQuery = await pool.query(`
          SELECT id, title
          FROM roles
          `);

    const employeesQuery = await pool.query(`
          SELECT id,
              CONCAT(first_name, ' ', last_name)
                  AS name
          FROM employees`);

    const roles = rolesQuery.rows;
    const employees = employeesQuery.rows;

    const roleOptions = roles.map((role) => ({
      name: role.title,
      value: role.id,
    }));

    const managerOptions = employees.map((employee) => ({
      name: employee.title,
      value: employee.id,
    }));

    managerOptions.push({
      name: "None",
      value: null,
    });

    const answer = await inquirer.prompt([
      {
        type: "input",
        name: "firstName",
        message: "What is the first name of the employee?",
        validate: (input) =>
          input ? true : "Invalid input. Please try again.",
      },
      {
        type: "input",
        name: "lastName",
        message: "What is the last name of the employee?",
        validate: (input) =>
          input ? true : "Invalid input. Please try again.",
      },
      {
        type: "list",
        name: "roleId",
        message: "What is the role of the employee?",
        choices: roleOptions,
      },
      {
        type: "list",
        name: "managerId",
        message: "Who is the manager of the employee?",
        choices: managerOptions,
      },
    ]);

    const result = await pool.query(
      `
          INSERT INTO employees (first_name, last_name, role_id, manager_id)
          VALUES ($1, $2, $3, $4)
          RETURNING id, first_name, last_name, role_id, manager_id
          `,
      [answer.firstName, answer.lastName, answer.roleId, answer.managerId]
    );

    console.log("New Employee added.");
    init();
  } catch (error) {
    console.log(error);
  }
};
const updateEmployee = async () => {
  try {
    const rolesQuery = await pool.query(`
          SELECT id, title
          FROM roles
          `);

    const employeesQuery = await pool.query(`
          SELECT id,
              CONCAT(first_name, ' ', last_name)
                  AS name
          FROM employees`);

    const roles = rolesQuery.rows;
    const employees = employeesQuery.rows;

    const roleOptions = roles.map((roles) => ({
      name: roles.title,
      value: roles.id,
    }));

    const employeeOptions = employees.map((employees) => ({
      name: employees.name,
      value: employees.id,
    }));

    const answer = await inquirer.prompt([
      {
        type: "list",
        name: "employeeId",
        message: "What employee would you like to update?",
        choices: employeeOptions,
      },
      {
        type: "list",
        name: "roleId",
        message: "What is the new role for the employee?",
        choices: roleOptions,
      },
    ]);

    const result = await pool.query(
      `
          UPDATE employees
          SET role_id = $1
          WHERE id = $2
          RETURNING id, first_name, last_name, role_id
          `,
      [answer.roleId, answer.employeeId]
    );

    console.log("New Employee added.");
    init();
  } catch (error) {
    console.log(error);
  }
};
