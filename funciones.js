const path = require('node:path');
const fs = require('node:fs');

//es la ruta es absoluta?
function isAbsolute(route) {
  const currentPath = path.isAbsolute(route);
  return currentPath;
}
console.log(isAbsolute('prueba\readmeprueba.md'));
