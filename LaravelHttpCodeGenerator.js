const window = {}
const generator = require('generator.js')

// Extensions are implemented as JavaScript classes
const LaravelHttpCodeGenerator = function() {
    // implement the generate() method to generate code
    this.generate = generator

};

// set the extension identifier (must be same as the directory name)
LaravelHttpCodeGenerator.identifier = "com.bfgdivision.PawExtensions.LaravelHttpCodeGenerator";
// give a display name to your Code Generator
LaravelHttpCodeGenerator.title = "Laravel Http Code Generator";
LaravelHttpCodeGenerator.languageHighlighter = 'php';
// call to register function is required
registerCodeGenerator(LaravelHttpCodeGenerator);
