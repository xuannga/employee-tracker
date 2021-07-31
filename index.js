const inquirer = require('inquirer');
// Import and require mysql2
const mysql = require('mysql2');
const cTable = require('console.table');

function initApp() {
    runPrompts();
}

function runPrompts() {
    prompt([{
        //prompts to load when npm start
        type: "list",
        name: "options",
        message: "What do you want to to?",
        choices: [{
                name: "View ALL Departments",
                value: "VIEW_DEPARTMENTS"
            },
            {
                name: "View ALL Roles",
                value: "VIEW_ROLES"
            },
            {
                name: "View ALL Employees",
                value: "VIEW_EMPLOYEES"
            },
            {
                name: "Add a Department",
                value: "ADD_DEPARTMENT"
            },
            {
                name: "Add a Role",
                value: "ADD_ROLE"
            },
            {
                name: "Add an Employee",
                value: "ADD_EMPLOYEE"
            },
            {
                name: "Update Employee Role",
                value: "UPDATE_EMPLOYEE_ROLE"
            },
            {
                name: "Quit",
                value: "QUITE"
            }
        ]
    }]).then(response => {
        let choice = response.options;
        switch (choice) {
            case "VIEW_DEPARTMENTS":
                viewAllDepart();
                break;
            case "VIEW_ROLES":
                viewAllRoles();
                break;
            case "VIEW_EMPLOYEES":
                viewAllEmployees();
                break;
            case "ADD_DEPARTMENT":
                createDepartment();
                break;
            case "ADD_ROLE":
                createRole();
                break;
            case "ADD_EMPLOYEE":
                createEmployee();
                break;
            case "UPDATE_EMPLOYEE_ROLE":
                updateEmployeeRole();
                break;
            default:
                quit();
        }
    })
}

//view all employee
function viewAllEmployees() {
    db.allEmployees()
        .then(([rows]) => {
            let employees = rows;
            console.log("\n");
            console.table(employees);
        }).then(() => runPrompts());
}

//view all roles
function viewAllRoles() {
    db.allRoles()
        .then(([rows]) => {
            let roles = rows;
            console.log("\n");
            console.table(roles);
        }).then(() => runPrompts());
}

//view all departments
function viewAllDepart() {
    db.allDepart()
        .then(([rows]) => {
            let depart = rows;
            console.log("\n");
            console.table(depart);
        }).then(() => runPrompts());
}

//add a role
function createRole() {
    db.allDepart()
        .then(([rows]) => {
            let departments = rows;
            const departChoices = rows;
            const departChoices = departments.map(({ id, name }) => ({
                name: name,
                value: id
            }));

            prompt([{
                    name: "title",
                    message: "What is the role name?"
                },
                {
                    name: "salary",
                    message: "What is the salary?"
                },
                {
                    type: "list",
                    name: "department_id",
                    message: "Which department does the role belong to?",
                    choices: departChoices
                }
            ]).then(role => {
                db.addRole(role)
                    .then(() => console.log(`Added ${role.title} to the databse`))
                    .then(() => runPrompts())
            })
        })
}

//add a department
function createDepartment() {
    prompt([{
        name: "name",
        message: "What is the name of the department?"
    }]).then(res => {
        let name = res;
        db.addDepartment(name)
            .then(() => console.log(`Added ${name.name} to the database`))
            .then(() => runPrompts())
    })
}

//add an employee
function createEmployee() {
    prompt([{
            name: "first_name",
            message: "First name of employee?"
        },
        {
            name: "last_name",
            message: "Last name of employee?"
        },
    ]).then(res => {
        let firstName = res.first_name;
        let lastName = res.last_name;
        db.allRoles()
            .then(([rows]) => {
                let roles = rows;
                const roleChoices = roles.map(({ id, title }) => ({
                    name: title,
                    value: id
                }));

                prompt({
                        type: "list",
                        name: "roleId",
                        message: "What is the employee's role?",
                        choices: roleChoices
                    })
                    .then(res => {
                        let roleId = res.roleId;
                        db.allEmployees()
                            .then(([rows]) => {
                                let employees = rows;
                                const managerChoices = employees.map(({ id, first_name, last_name }) => ({
                                    name: `${first_name} ${last_name}`,
                                    value: id
                                }));

                                managerChoices.unshift({ name: "None", value: null });

                                prompt({
                                        type: "list",
                                        name: "manager_id",
                                        message: "Who's the employee's manager?",
                                        choices: managerChoices
                                    }).then(res => {
                                        let employee = {
                                            manager_id: res.managerId,
                                            role_id: roleId,
                                            first_name: firstName,
                                            last_name: lastName
                                        }
                                        db.addEmployee(employee);
                                    }).then(() => console.log(`Added ${firstName} ${lastName} to the database`))
                                    .then(() => runPrompts())

                            })
                    })
            })

    })
}

//updateEmployeeRole
function updateEmployeeRole() {
    db.allEmployees()
        .then(([rows]) => {
            let employees = rows;
            const employeeChoices = employees.map(({ id, first_name, last_name }) => ({
                name: `${first_name} ${last_name}`,
                value: id
            }));
            prompt([{
                type: "list",
                name: "employeeId",
                message: "Which employee's role do you want to update?",
                choices: employeeChoices
            }]).then(res => {
                let employeeId = res.employeeId;
                db.allRoles()
                    .then(([rows]) => {
                        let roles = rows;
                        const roleChoices = roles.map(({ id, title }) => ({
                            name: title,
                            value: id
                        }));

                        prompt([{
                                type: "list",
                                name: "roleId",
                                message: "What's the new role of this employee?",
                                choices: roleChoices
                            }]).then(res => db.updateEmployeeRole(employeeId, res.roleId))
                            .then(() => console.log("Employee's role is updated"))
                            .then(() => runPrompts())
                    });
            });
        })
}
//quit
function quit() {
    process.exit();
}