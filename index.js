module.exports = {
  validateParameter,
  generateRoute,
  routeExists,
  isDirectory,
  getMds,
  getLinks,
};


const path = require('path');
let fs = require('fs');
const axios = require('axios');

let allFiles = []


mdLink('directorio1', {validate: true})
/*-------------------------------------------------------- */
function mdLink(ruta, option = { validate: false }) {
  return new Promise((resolve, reject) => {
    validateParameter(ruta, option);
    ruta = generateRoute(ruta);
    routeExists(ruta);
    let pathType = isDirectory(ruta);
    let filesMd;
    if (pathType == true) {
      const allFile = searchFiles(ruta);
      filesMd = getMds(allFile);
      const promises = filesMd.map((file) => processFile(file, option));
      Promise.all(promises)
        .then((results) => {
          const flattenedResults = results.flat();
          flattenedResults.forEach((result) => {
            console.log(result);
          });
          resolve(flattenedResults);
        })
        .catch((error) => {
          console.error(error);
          reject(error);
        });
    } else {
      allFiles.push(ruta);
      filesMd = getMds(allFiles);
      processFile(filesMd[0], option)
        .then((result) => {
          console.log(result[0]);
          resolve(result);
        })
        .catch((error) => {
          console.error(error);
          reject(error);
        });
    }
  });
}
function processFile(file, option) {
  console.log(file);
  return new Promise((resolve, reject) => {
    readFile(file)
      .then((data) => {
        let objLink = getLinks(data, file);
        if (option.validate === true) {
          return getEstatus(objLink);
        } else {
          return objLink;
        }
      })
      .then((result) => {
       // console.log(result);
        resolve(result);
      })
      .catch((error) => {
        console.error(error);
        reject(error);
      });
  });
}
//TERMINADAS
/*---------- testeadas------------ */
function validateParameter(ruta, option) {
  if (ruta === null) {
    throw new TypeError("La ruta no debe ser nula");
  }
  if (typeof option !== "object" || option === null || typeof option.validate !== "boolean") {
    throw new TypeError('Debe ingresar un objeto que contenga un booleano en la propiedad "validate"');
  }
}

function generateRoute(ruta){
  if(!path.isAbsolute(ruta)){
    const pathObsolute =  path.resolve(ruta);
    return pathObsolute
  }else{
    console.log('la ruta es relativa')
  return ruta
  }
}

function routeExists(ruta) {
  if (fs.existsSync(ruta)) {
    console.log('la ruta existe')
    return ruta;
  } else {
    console.log('la ruta no existe')
    throw new TypeError("La ruta no existe");
  }
}

function isDirectory(ruta){
  if(fs.lstatSync(ruta).isDirectory()){
    console.log("es un directorio")
    return true
  }else{
    console.log('es un archivo')
    return false
  }
}

function getMds(allfiles) {
  const archivosMd = allfiles.filter(archivo => {
    if (typeof archivo === "string" && archivo.split(".").pop() === "md") {
      console.log("archivos md: ",  archivo);
      return true;
    } else {
      //console.log("No es md: ", archivo);
      return false;
    }
  });

  if(archivosMd.length > 0){
    //console.log("array filtrado: ", allFiles)
  return archivosMd;
  }else{
    console.log("fin del flujo, no se encontro md")
  }
}
/* ------------------------------- */

function getLinks(content, file) {
  const regexMdLinks = /\[([^\[]+)\](\(.*\))/gm;
  const links = [];

  const matches = content.matchAll(regexMdLinks);
  for (const match of matches) {
    const [, text, href] = match;
    links.push({
      href: href.replace(/[()]/g, ''),
      text,
      file: file
    });
  }




}


/*---------- asincrona------------ */
function readFile(file) {
  return new Promise((resolve, reject) => {
    fs.readFile(file, 'utf-8', (err, data) => {
      if (err) {
        return reject("No fue posible leer el archivo");
      } else {
        resolve(data);
      }
    });
  });


}

function getEstatus(links) {
  const promise = links.map(objeto => {
    return axios.head(objeto.href)
      .then((response) => {
        if (response.status >= 200 && response.status < 300) {
          objeto.status = response.status;
          objeto.ok = 'ok';
        } else {
          objeto.status = response.status;
          objeto.ok = 'fail';
        }
        return objeto;
      })
      .catch((error) => {
        objeto.status = 'Error';
        objeto.ok = 'fail';
        return objeto;
      });
  });
  return Promise.all(promise);
}



function searchFiles(directorio){
  const archivos = fs.readdirSync(directorio);

  if (archivos.length === 0) {
    //console.log('El directorio está vacío');
  }
  archivos.forEach((file) => {
    const fileObsolute = path.resolve(directorio, file);
    if (fs.lstatSync(fileObsolute).isDirectory()){
      const getRecursiveFiles =searchFiles(fileObsolute)
      allFiles.concat(getRecursiveFiles)
    }else{
      allFiles.push(fileObsolute)
    }
  });

  return allFiles;
}
/* ------------------------------- */




