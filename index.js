const { program } = require('commander');
const inquirer = require('inquirer');
const { getVersion} = require("./getMeta")

program
    .version(getVersion())
    .option('-d, --debug', 'debugging')
    .option('-p, --path <type>', 'path to new component');

program.parse(process.argv);

const comp = "component"
const questions = [
    {
        type : "input",
        name : `${comp}.name`,
        message : "Component Name: "
    },
    {
        type : "input",
        name : `${comp}.path`,
        message : "Component Path: "
    },
    {
        type : "list",
        name : `${comp}.fileType`,
        message : "File Type: ",
        choices: [{name:"javascript", checked: true}, "typescript"]
    },
    {
        type : "checkbox",
        name : `${comp}.path`,
        message : "Component Files: ",
        choices: [ {name: "jsx", checked: true},"test", "scss", "css" ]
    },
]

const options = program.opts();
if (options.debug) console.log(options);

inquirer
    .prompt(questions)
    .then(answers => {
        console.log(answers)
        // Use user feedback for... whatever!!
    })
    .catch(error => {
        if(error.isTtyError) {
        // Prompt couldn't be rendered in the current environment
        } else {
        // Something else went wrong
        }
    });
