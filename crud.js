const inquirer = require('inquirer');
const mysql = require('mysql');


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
      message: 'Please select an option',
      choices: [
        'View All Employees'
      ],
    })
    .then(function(answers) {
      switch (answers.action) {
        case 'View All Employees':
          test();
          break;

        default:
          console.log(`Don't Do That!"`);
          break;
      }
    });
};

init();


connection.connect((err) => {
	if (err) throw err;

	connection.end();
});