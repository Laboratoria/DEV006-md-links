const path = require('path');

const { validatePath } = require('./validatePath');
const { isDirectory } = require('./isDirectory');
const { readFile } = require('./readFile');
const { toAbsolutePath } = require('./toAbsolutePath');
const { readDirectory } = require('./readDirectory');
const { verifyLinks } = require('./verifyLinks');


let mdLinks = (pathParameter, options) => {
  console.log("Path: ", pathParameter);
  let isValidPath = validatePath(pathParameter);
  console.log("is valid path? : " + isValidPath);

  if (isValidPath === false) {
    //console.log("FINN ...No encontramos rutas validas");
    return Promise.reject(new Error("No se encontraron rutas válidas"));
  }

  let absolutePath = toAbsolutePath(pathParameter);
  console.log("This is the route absolute : ", absolutePath);

  let extension = path.extname(absolutePath);
  if (extension === '.md') {
    return new Promise((resolve, reject) => {
      readFile(absolutePath).then((links) => {
        if( options.validate == true ){
          verifyLinks(links).then((verifiedLinks) => {
            resolve(verifiedLinks)
          }).catch( (error) => {
            reject(error);
          })
        } else {
          resolve(links)
        }
      }).catch((err) => {
        console.error(err);
        reject(err)
      });
    })
  } else {
    if (isDirectory(absolutePath) === true) {
      return new Promise((resolve, reject) => {
        readDirectory(absolutePath).then((archives) => {
          const readFilePromises = [];
          archives.forEach((archive) => {
            if (path.extname(archive) === '.md') {
              console.log('este archivo es .md: ' + archive)
              const path = pathParameter + archive;
              readFilePromises.push(readFile(path))
            }
          })
          Promise.all(readFilePromises).then((responses) => {
            const allLinks = [];
            responses.forEach((links) => {
              links.forEach((link) => {
                allLinks.push(link);
              })
            })

            if( options.validate == true ){
              verifyLinks(allLinks).then((verifiedLinks) => {
                resolve(verifiedLinks)
              })
            } else {
              resolve(allLinks)
            }
          })
        }).catch((error)=>{
          reject(error)
        });
      });

    } else {
      //console.log('FIN... ')
      return Promise.reject(new Error("La ruta no es un archivo .md ni un directorio"));
    }
  }

}


module.exports = {
  mdLinks
}
