const connect = require("./connection");

class employeeDb {

    constructor(connection) {
        this.connection = connection;
    }

    //show all employee
    allEmployees() {
        return this.connection.promise().query(
            "SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager FROM employee LEFT JOIN role on employee.role_id = role.id LEFT JOIN department on role.department_id = department.id LEFT JOIN employee manager on manager.id = employee.manager_id;"
        );
    }

    //add an employee
    addEmployee(employee) {
        return this.connection.promise().query("INSERT INTO employee SET ?", employee);
    }

    //updating the employee role
    updateEmployeeRole(employeeId, roleId) {
        return this.connection.promise().query("UPDATE emplopyee SET role_id = ? WHERE id = ?", [roleId, employeeId]);
    }

    //shows managers
    allManagers(employeeId) {
        return this.connection.promise().query(
            "SELECT id, first_name, last_name, FROM employee WHERE id ! = ?", employeeId);
    }

    //show all roles
    allRoles() {
        return this.connection.promise().query("SELECT role.id, role.title, department.name AS department, role.salary FROM role LEFT JOING department on role.department_id = department.id;");
    }

    //create role
    addRole(role) {
        return this.connection.promise().query("INSERT INTO role SET ?", role);
    }

    //show departments
    allDepartments() {
        return this.connection.promise().query("SELECT department.id, department.name FROM department;");
    }

    //add department
    adDepartment(department) {
        return this.connection.promise().query("INSERT INTO department SET ?", department);
    }
}

module.exports = new employeeDb(connect);