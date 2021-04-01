#!/usr/bin/env node

const { program } = require('commander');
const inquirer = require('inquirer');
const { buildComponent } = require('./buildComponent');
const { getVersion} = require("./getMeta")

program
    .version(getVersion())
    .option('-d, --debug', 'debugging')
    .option('-t, --test', 'Added for testing to bypass questions')

program.parse(process.argv);

const questions = [
    {
        type : "input",
        name : `name`,
        message : "Component Name: "
    },
    {
        type : "input",
        name : `path`,
        default: "/src/components",
        message : "Component Path: "
    },
    {
        type : "list",
        name : `fileType`,
        message : "File Type: ",
        choices: [{name:"javascript", checked: true}, "typescript"]
    },
    {
        type : "checkbox",
        name : `files`,
        message : "Component Files: ",
        choices: [ {name: "jsx", checked: true},"test", "scss", "css" ]
    },
]

const options = program.opts();
if (options.debug) console.log(options);

if(options.test){
    const testData = {
        name: 'Test Component',
        path: '/src/components',
        fileType: 'javascript',
        files: [ 'jsx','scss','test' ]
      }
    buildComponent(testData, true)
}
else{
    inquirer
    .prompt(questions)
    .then(answers => {
        // console.log(answers)
        buildComponent(answers, options.debug)
        // Use user feedback for... whatever!!
    })
    .catch(error => {
        if(error.isTtyError) {
        // Prompt couldn't be rendered in the current environment
        } else {
        // Something else went wrong
        }
    });

}