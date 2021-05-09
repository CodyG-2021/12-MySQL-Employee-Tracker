const inquirer = require('inquirer');
const mysql = require('mysql');
const figlet = require('figlet');
const cTable = require('console.table');


const connection = mysql.createConnection({
	host: "localhost",
	port: 3306,
	user: "root",
	password: "password",
	database: "employee_db",
});

function init() {
	inquirer
		.prompt({
			name: 'choice',
			type: 'list',
			message: 'What would you like to do?',
			choices: [
				'View all Employees.',
				'View Salaries.',
				'View all Departments.',
				'View all Roles.',
				'Update Employee Role.',
				'Add Department, Role, or Employee.',
				'Exit'
			],
		})
		.then((res) => {
			switch (res.choice) {
				case 'View all Employees.':
					employeeSearch();
					break;
				case 'View Salaries.':
					employeeSalaries();
					break;
				case 'Add Department, Role, or Employee.':
					addOption();
					break;
				case 'View all Departments.':
					showDept();
					break;
				case 'View all Roles.':
					showRoles();
					break;
				case 'Update Employee Role.':
					updateRole();
					break;
				default:
					console.log('Thanks for using the app!');
					connection.end();
					break;
			}
		});
};

function employeeSearch() {
	connection.query(
		`SELECT 
			CONCAT(e.first_name, ' ', e.last_name) AS 'Name',
			r.title AS 'Title',
			d.name AS 'Department'
		  FROM employee e
		  LEFT JOIN role r ON e.role_id = r.id
			LEFT JOIN department d ON r.department_id = d.id`,
		(err, res) => {
			if (err) throw err;
			console.table("-Employees-", res);
			init();
		}
	);
};

function employeeSalaries() {
	connection.query(
		`SELECT 
		CONCAT(e.first_name, ' ', e.last_name) AS 'Name',
		r.salary AS 'Salary'
		FROM employee e
		LEFT JOIN role r ON e.role_id = r.id`,
		(err, res) => {
			if (err) throw err;
			console.table("-Results-", res);
			init();
		}
	);
};

function showDept() {
	connection.query(
		`SELECT * FROM department`,
		(err, res) => {
			if (err) throw err;
			console.table("-Results-", res);
			init();
		}
	);
};

function showRoles() {
	connection.query(
		`SELECT * FROM role`,
		(err, res) => {
			if (err) throw err;
			console.table("-Results-", res);
			init();
		}
	);
};

function updateRole() {

	connection.query(
		`SELECT
		e.id AS 'ID',
		CONCAT(e.first_name, ' ', e.last_name) AS 'Name',
		r.title AS 'Role'
		FROM employee e
		LEFT JOIN role r ON e.role_id = r.id
		ORDER BY e.id`,
		(err, res) => {
			if (err) throw err;
			console.table("-Current Employee Roles-", res);
		}
	);

	connection.query(
		`SELECT id AS 'ID', title AS 'ROLE' FROM role ORDER BY id`,
		(err, res) => {
			if (err) throw err;
			console.table("-Available Roles-", res);
		}
	);
	setTimeout(function(){
		inquirer
		.prompt([
			{
			name: 'updateID',
			type: 'input',
			message: 'Select the ID of the employee you want to update.'
		},
		{
			name: 'roleID',
			type: 'input',
			message: 'Select the ID of the role you want.'
		}
		]).then((res) =>{
			connection.query(
				`UPDATE employee
				SET role_id = ${res.roleID} 
				WHERE id = ${res.updateID} `,
				(err, res) => {
					if (err) throw err;
					console.log("Role Updated");
					init();
				})
		}); 
	}, 1000);

};

function addOption() {
	inquirer
	.prompt([
		{
			name: 'add',
			type: 'list',
			message: 'Select an option to add',
			choices: ['Department', 'Role', 'Employee', 'Exit']
		}
	]).then((res) => {
		switch (res.add) {
			case 'Department':
				addDepartment();
				break;
			case 'Role':
				addRole();
				break;
			case 'Employee':
				addEmployee();
				break;
			default:
				init();
				break;
		}
	})
};

function addDepartment() {
	inquirer
	.prompt([
		{
			name: 'dept',
			type: 'input',
			message: 'What department would you like to add?'
		}
	]).then((res) => {
		connection.query(
			`INSERT INTO department (name)
			VALUES ('${res.dept}')`,
			(err, res) => {
				if (err) throw err;
				console.table('Department Added.');
				init();
			}
		)
	})
};
function addRole() {
	inquirer
	.prompt([
		{
			name: 'dept',
			type: 'input',
			message: 'What role would you like to add?'
		}
	]).then((res) => {
		connection.query(
			`INSERT INTO department (name)
			VALUES ('${res.dept}')`,
			(err, res) => {
				if (err) throw err;
				console.table('Department Added.');
				init();
			}
		)
	})
};

connection.connect((err) => {
	if (err) throw err;
	console.log('----------------------------------------------------------------------------------');
	console.log(figlet.textSync('Employee Tracker', {
		//cosmike font looks cool
		font: 'Star Wars',
		horizontalLayout: 'default',
		verticalLayout: 'default',
		width: 120,
		whitespaceBreak: true
	}));
	console.log('----------------------------------------------------------------------------------');
	console.log('\n');
	init();
});