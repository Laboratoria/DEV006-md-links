const path = require('path');

const { validatePath } = require('./validatePath');
const { isDirectory } = require ('./isDirectory');
const { readFile } = require ('./readFile');
const { toAbsolutePath } = require ('./toAbsolutePath');
const { readDirectory } = require ('./readDirectory')


let mdLinks = (pathParameter, options) => {
  console.log("Path: ", pathParameter);
  let isValidPath = validatePath(pathParameter);
  console.log("is valid path? : " + isValidPath);
  
  if(isValidPath === false){
    console.log("FINN ...No encontramos rutas validas");
    return;
  } 
  
  let absolutePath = toAbsolutePath(pathParameter);
  console.log("This is the route absolute : ", absolutePath);

  let extension = path.extname(absolutePath);
  if(extension === '.md'){
    console.log( 'extension : ' + extension )
    readFile(absolutePath).then((links) => {
      console.log("Links: ", links)

    }).catch((err) => {
      console.error(err);
    });
    //funcion que lee linea por linea del archivo y imprime en consola


  } else {
    if(isDirectory(absolutePath) === true){
      console.log('Listar los links del archivo')
      readDirectory(absolutePath).then((archives)=>{
        console.log(archives);
        archives.forEach((archive)=>{
          if(path.extname(archive) === '.md'){
            console.log('este archivo es .md: ' + archive)
            const path = pathParameter + archive;
            readFile(path).then((links)=>{
            
              console.log('estos son los links del archivo :' + archive)
              console.log(links)
            })
          }
        })
        console.log(archives);
      }).catch();
      // funcion que lea los archivos de una carpeta para iterar uno por uno para ver si es o no .md

    } else {
      console.log('FIN... ')
      return;
    }
  }

}


let pathArgument = process.argv[2]

mdLinks(pathArgument);


module.exports = () => {  
};