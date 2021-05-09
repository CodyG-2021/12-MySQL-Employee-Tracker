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
        'View All Employees'
      ],
    })
    .then((answers) => {
      switch (answers.choice) {
        case 'View All Employees':
          employeeSearch();
          break;

        default:
          console.log(`Don't Do That!"`);
          break;
      }
    });
};

const employeeSearch = () => {
	connection.query(
			`SELECT 
			  CONCAT(e.first_name, ' ', e.last_name) AS 'Name',
			  r.title AS 'Title'
		  FROM employee e
		  LEFT JOIN role r ON e.role_id = r.id`,
			(err, res) => {
					if (err) throw err;
					console.table("All Employees", res);
					init();
			}
	);
};


//cosmike font looks cool
connection.connect((err) => {
	if (err) throw err;
	console.log(figlet.textSync('Employee Tracker', {
    font: 'Star Wars',
    horizontalLayout: 'default',
    verticalLayout: 'default',
    width: 120,
    whitespaceBreak: true
}));
console.log('\n');
	init();
});