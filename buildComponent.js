const fs = require('fs');
const path = require('path')

function buildComponent(componentData, debug=false) {
    if(debug) console.log("component", componentData)

    //Creates the component name
    let componentName = ""
    const words = componentData.name.split(" ");
    for (let i = 0; i < words.length; i++) {
        componentName += words[i][0].toUpperCase() + words[i].substr(1).toLowerCase();
    }
    const currentDir = path.join(__dirname, `${componentData.path}/${componentName}`);
    if(debug) console.log(currentDir)

    //Sets the file ending
    let fileEnding = "js";
    if(componentData.fileType === "typescript"){
        fileEnding = "ts";
    }
    if(debug) console.log("file ending", fileEnding)

    //Creates the folders
    try {
        console.log("path exists",fs.existsSync(currentDir))
        if (!fs.existsSync(currentDir)) {
            console.log("Building folder")
          fs.mkdirSync(currentDir, { recursive: true })
        }
    } catch (err) {
        console.error(err)
    }

    //Write JSX File
    if(componentData.files.includes("jsx")){
        var jsxFile = fs.createWriteStream(`${currentDir}/${componentName}.${fileEnding}`);

        jsxFile.once('open', (fd) => {
            jsxFile.write("import React from 'react'\n");
            //Add the scss
            if(componentData.files.includes("scss")){
                jsxFile.write(`'./${componentName}.scss'\n`);
            }
            //Add the css
            if(componentData.files.includes("css")){
                jsxFile.write(`'./${componentName}.css'\n\n `);
            }
        
            //Create the component
            jsxFile.write(`
const ${componentName} = () => {
    return (
    <div data-testid="${componentName.toLowerCase()}">
    
    </div>
    )
}

export default ${componentName} 
           `);

            // Important to close the stream when you're ready
            jsxFile.end();
        });
    }

    //Write Scss File
    if(componentData.files.includes("scss")){
        var scssFile = fs.createWriteStream(`${currentDir}/${componentName}.scss`);
    }
    
    if(componentData.files.includes("css")){
        var scssFile = fs.createWriteStream(`${currentDir}/${componentName}.css`);
    }
    
    if(componentData.files.includes("test")){
        var testFile = fs.createWriteStream(`${currentDir}/${componentName}.test.${fileEnding}`);

        const imports = `import React from 'react'\n import { render, fireEvent, screen } from '@testing-library/react'\n import { ${componentName} } from './${componentName}.js'`

        const setUp = `\nconst setup = () => {
    const utils = render(<${componentName} />)
    const input = utils.getByTestId('${componentName.toLowerCase()}')
    return {
        input,
        ...utils,\n}\n}`

        const firstTest = `\ntest('renders ${componentName}', () => {
    const { input } = setup();
    expect(input).toBeInTheDocument();\n});`

        testFile.write(imports);
        testFile.write(setUp);
        testFile.write(firstTest);

        testFile.end();

    }

    return true;
}

exports.buildComponent = buildComponent;