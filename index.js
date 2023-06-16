/*export default () => {
  const fs = required('fs')
};*/

const path = require('path');
let fs = require('fs');

let allFiles = []

mdLink('C://Users/ange_/DEV006-md-links/directorio1/')
/*-------------------------------------------------------- */
function mdLink(ruta, option = {validate: false}){
  validate(ruta, option)
  ruta = generateRoute(ruta)
  console.log('Ruta absoluta:', ruta);
  routeExists(ruta)
  let pathType= isDirectory(ruta)
  //TODO:refactorizar el if
  if( pathType == true){
    const allFile = searchFiles(ruta)
    const filesMd =getMds(allFile)
  }else{
    allFiles.push(ruta)
    getMds(allFiles)
    const filesMd =getMds(allFile)
  }
 //TODO: crear una promesa y a regresar
}
/*-------------------------------------------------------- */
function processFile(files){
  console.log(files)
  //TODO: verificar la extencion de cada archivo 
  //TODO: abrir el archivo y obtener los link 
  //TODO:  -validate: true

}

//TODO: revisar leerArchivo y cambiar nombre 
async function leerArchivo(ruta){
  //Para este proyecto te sugerimos no utilizar la versión síncrona de 
  //la función para leer archivos, readFileSync, y en cambio intentar 
  //resolver este desafío de manera asíncrona.
  // TODO: asincrono
  fs.readFile(ruta, 'utf-8', (err, data) => {
    if (err){
       throw err;}
    console.log("El contenido es: ", data);
    // BLOQUEO: ¿Debo aca obtener los link?
    //TODO: Debe retornar algo ?
    
  })
}

//TERMINADAS    
function validate(ruta, option){
  if(ruta == null){
    throw new TypeError("La ruta no debe ser nula")
  }
  if(typeof option === "boolean"){
    throw new TypeError("debe ingresar un booleano")
  }
}

function generateRoute(ruta){
  if (path.isAbsolute(ruta)){
    console.log("es absoluta")
  }else{
    console.log("es relativa")
    ruta = path.resolve(ruta);
    }
  return ruta
}

function routeExists(ruta){
  //sincrono
  try {
    fs.accessSync(ruta);
    console.log("la ruta existe")
    return ruta
  } catch (error) {
    throw new TypeError("La ruta no existe")
  }
}

function isDirectory(ruta){
  if(fs.lstatSync(ruta).isDirectory()){
    console.log("es un directorio")
    return true
  }else{
    
    console.log("es un archivo")
  }
}

function searchFiles(directorio){
  const archivos = fs.readdirSync(directorio);

  if (archivos.length === 0) {
    console.log('El directorio está vacío');
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

function getMds(allfiles) {
  const archivosMd = allfiles.filter(archivo => {
    if (typeof archivo === "string" && archivo.split(".").pop() === "md") {
      console.log("Es md: ",  archivo);
      return true;
    } else {
      console.log("No es md: ", archivo);
      return false;
    }
  });

  allfiles.length = 0; 
  allFiles.push.apply(allfiles, archivosMd);
  

  if(allFiles.length > 0){
    console.log("array filtrado: ", allFiles)
  return allfiles;
  }else{
    console.log("fin del flujo, no se encontro md")
  }
}