const path = require ('path');
const fs = require ('fs');

const validateFile= (filePath => {
    if (fs.existsSync(filePath)){
        console.log('El archivo existe:', filePath);
    } else {
        console.error('El archivo no existe:', filePath);
    }
});

const files = (filePath) => {
    const isAbsolute = path.isAbsolute(filePath);

    if (isAbsolute) {
        console.log ('La ruta es absoluta.');
        console.log ('Archivo a revisar:', filePath);
        console.log(filePath);
        validateFile(filePath);
    } else {
        console.log('La ruta es relativa.');
        const absolutePath = path.join(__dirname, filePath);
        console.log(absolutePath);
        console.log('Archivo a revisar:', filePath);
        validateFile(absolutePath);
    }
};

module.exports = files;

files('C:/Users/cuc22/Documents/Laboratoria/MD-Links/DEV006-md-links/src/index.js');
files('index.js');