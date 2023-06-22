const fs = require('fs');

function isDirectory (path){
  try {
    if(fs.lstatSync(path).isDirectory()){
      console.log('the path is directory');
      return true;
    } else {
      return false;
    }
  } catch (err) {
    console.error('Error al verificar la ruta: ', err);
    return false;
  }
}


module.exports = {
  isDirectory
}