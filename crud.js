const inquirer = require('inquirer');
const mysql = require('mysql');
const figlet = require('figlet');


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