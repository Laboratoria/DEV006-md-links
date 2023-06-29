
let fs = require('fs');

console.log('C://Users/ange_/DEV006-md-links/hola.txt'.split(".").pop())

function leerArchivo(){
  console.log("dentro de funcion")
  fs.readFile('C://Users/ange_/DEV006-md-links/hola.txt', 'utf-8', (err, data) => {
    if (err) throw err;
    console.log("El contenido es: ", data);
  })
  console.log("saliendo de la funcion")
}
leerArchivo();


