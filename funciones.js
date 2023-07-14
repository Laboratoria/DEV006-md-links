const path = require('node:path');
const fs = require('node:fs');

//es la ruta es absoluta?
function isAbsolute(route) {
  const currentPath = path.isAbsolute(route);
  return currentPath;
}
//console.log(isAbsolute('prueba\readmeprueba.md'));

function isExist(route) {
  return fs.existsSync(route)
}


//convertir ruta relativa a absoluta
function toAbsolute(currentPath) {
  let absolutePath = '';

  if (path.isAbsolute(currentPath) && isExist(currentPath)) {
      absolutePath = currentPath.replace(/\\/g,'/');
  } else if (isExist(currentPath)){
      absolutePath = path.resolve(currentPath).replace(/\\/g,'/');
  } else {
    absolutePath = "tu ruta no existe";
  }

  return absolutePath + ' absolute path';
}
console.log(toAbsolute('./prueba/readmeprueba.md'));


