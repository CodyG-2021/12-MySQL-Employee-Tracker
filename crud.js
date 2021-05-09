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
				'View all Departments.',
				'View all Roles.',
				'Add Department, Role, or Employee.',
				'Exit'
			],
		})
		.then((res) => {
			switch (res.choice) {
				case 'View all Employees.':
					employeeSearch();
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
				default:
					console.log('Thanks for using the app!');
					connection.end();
					break;
			}
		});
};

//Pulls the employee their title and role.
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

function addOption () {
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

// function addDepartment() {
// 	inquirer
// 	.prompt([
// 		{
// 			name: 'dept',
// 			type: 'input',
// 			message: 'What department would you like to add?'
// 		}
// 	]).then((res) => {
// 		connection.query(
// 			`INSERT INTO department (name)
// 			VALUES ('${res.dept}')`,
// 			(err, res) => {
// 				if (err) throw err;
// 				console.table('Department Added.');
// 				init();
// 			}
// 		)
// 	})
// };

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