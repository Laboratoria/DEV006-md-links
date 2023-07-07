const {mdLinks} = require('./mdLinks')

let pathArgument = process.argv[2]

mdLinks(pathArgument, { validate: true }).then((data) => {
  console.log("Data: ", data)
});

