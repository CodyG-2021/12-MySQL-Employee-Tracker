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
				'Add Department, Role, or Employee.'
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
				default:
					console.log('Invalid option restarting...');
					init();
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
			console.table("All Employees", res);
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
		switch (res.choice) {
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

connection.connect((err) => {
	if (err) throw err;
	console.log(figlet.textSync('Employee Tracker', {
		//cosmike font looks cool
		font: 'Star Wars',
		horizontalLayout: 'default',
		verticalLayout: 'default',
		width: 120,
		whitespaceBreak: true
	}));
	console.log('\n');
	init();
});