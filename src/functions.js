const path = require('path');
const fs = require('fs');
const { markAsUntransferable } = require('worker_threads');
const { JSDOM } = require('jsdom');
const MarkdownIt = require('markdown-it');
const { error } = require('console');


// Valida el archivo
function validateFile(filePath) {
    return fs.existsSync(filePath);
}

// Valida si la ruta es absoluta 
const isAbsolute = (filePath) => path.isAbsolute(filePath); //isAbsolute

//Convierte la ruta relativa a absoluta
//const absolutePath = (filePath) => path.join(__dirname, filePath);
const absolutePath = (filePath) => path.resolve(filePath);
//Es un archivo
const isAFile = (filePath) => {
    return fs.statSync(filePath).isFile();
};

// const files = (filePath) => {
//     const isAbsolute = path.isAbsolute(filePath); //isAbsolute
//     if (isAbsolute) {
//         console.log('La ruta es absoluta.');
//         console.log('Archivo a revisar:', filePath);
//         console.log(filePath);
//         validateFile(filePath);
//     } else {
//         console.log('La ruta es relativa.');
//         const absolutePath = path.join(__dirname, filePath); //converterAbsolute
//         console.log(absolutePath);
//         console.log('Archivo a revisar:', filePath);
//         validateFile(absolutePath);
//     }
// };



// Revisa si es un directorio
const isADirectory = (filePath) => fs.statSync(filePath).isDirectory();

//Leer archivos de un directorio 
const readDirectory = (filePath) => {
    // try {
    //     const files = fs.readdirSync(directoryPath); // revisar y hacer el cambio con readdir
    //     console.log('Archivos en el directorio:', files);
    // } catch (error) {
    //     console.error('Error al leer el directorio', error);
    // }
    return new Promise ((resolve, reject) =>{
        fs.readdir(filePath, "utf-8", (error, routes) =>{
            if (error){
                reject(error);
            } else{
                const arrayMd = [];
                routes.forEach((file) =>{
                    const resultExt = path.extname(file);
                    if (resultExt === ".md"){
                        const routeAbsolute = path.resolve(filePath, file);
                        arrayMd.push(routeAbsolute);
                    }
                });
                resolve(arrayMd);
            }
        });
    });
};

//Lee el archivo
const readTextFile = (filePath) => {
    return new Promise((resolve, reject) => {
        // const currentFilePath = __filename;
        // const absolutePath = path.resolve(path.dirname(currentFilePath), filePath);

        fs.readFile(filePath, 'utf-8', (error, data) => {
            if (error) {
                reject(error);
            } else {
                resolve(data);
            }
    });
});
};

// Valida si la extensión es .md
const validateMd = (filePath) => { // isMd
    const extension = path.extname(filePath);
    //console.log(extension);
    if (extension === '.md') {
        //console.log('Es un archivo Markdown.');
        return true;
    } else {
        //console.log('No es un archivo Markdown');
        return false;
    }
};

// Revisa si hay links dentro del archivo y los extrae 

const extractLinks = (data, fileName) =>{
    // console.log(filePath, 'Extract Links argumentos');
    // const promiseReadFile = (resolve, reject) => {
    //     fs.readFile(filePath, 'utf-8', (error, mdContent) => {
    //         if (error) {
    //             reject (error);
    //         } else {
                const allLinks = [];
                //const mdRender = new MarkdownIt();
                const mdRender = MarkdownIt();
                const renderHtml = mdRender.render(data);
                const dom = new JSDOM(renderHtml);
                const { document } = dom.window;
                const links = document.querySelectorAll('a');
    
                links.forEach((link) => {
                    const href = link.getAttribute('href');
                    const text = link.textContent.slice(0, 50);
                    if (href.startsWith('https://') || href.startsWith('http://')) {
                        allLinks.push({ href, text, fileName });
                    }
                });
                return(allLinks);
                
            };
    
//         });
//     }
//     return new Promise(promiseReadFile);

// }

const extractLinks2 = (filePath, fileName) => {
    
    fs.readFile(filePath, 'utf-8', (error, mdContent) => {
        if (error) {
            console.error('Error al leer el archivo:', error);
        } else {
            const allLinks = [];
            const mdRender = new MarkdownIt();
            const renderHtml = mdRender.render(mdContent);
            const dom = new JSDOM(renderHtml);
            const { document } = dom.window;
            const links = document.querySelectorAll('a');

            links.forEach((link) => {
                const href = link.getAttribute('href');
                const text = link.textContent.slice(0, 50);
                if (href.startsWith('https://') || href.startsWith('http://')) {
                    allLinks.push({ href, text, fileName });
                }
            });
            return allLinks;
            console.log(allLinks, 'estos son los links');
            
        }

    });
};

// Verifica si son vàlidos los links
const verifyLinks = (links) => {
    //console.log(links);
    const arrayPromise = links.map((link) => {
        return new Promise((resolve, reject) => {
            fetch(link.href)
                .then((response) =>{
                    const result ={
                        Ruta:link.fileName,
                        Texto: link.text,
                        Link: link.href,
                        Codigo: response.status === 200 ? 200 : 404,
                        Estado: response.status === 200 ? 'OK' : 'FAIL',
                    };
                    resolve(result);
                })
                .catch((error) =>{
                    const result = {
                        Ruta: link.fileName,
                        Texto: link.text,
                        Link:link.href,
                        Codigo: error.name,
                        Estado: error.message, 
                    };
                    resolve(result);
                });
        });
    });
    return Promise.all(arrayPromise);
};



// validateFile('C:/Users/cuc22/Documents/Laboratoria/MD-Links/DEV006-md-links/src/index.js');
// absolutePath('C:/Users/cuc22/Documents/Laboratoria/MD-Links/DEV006-md-links/src/index.js');
// absolutePath('index.js');
// readTextFile('text.txt');
// readTextFile('C:/Users/cuc22/Documents/Laboratoria/MD-Links/DEV006-md-links/src/prueba.md');
// validateMd('C:/Users/cuc22/Documents/Laboratoria/MD-Links/DEV006-md-links/src/prueba.md');
// readDirectory('./pruebas');
// extractLinks('C:/Users/cuc22/Documents/Laboratoria/MD-Links/DEV006-md-links/src/pruebas/prueba2.md', 'C:/Users/cuc22/Documents/Laboratoria/MD-Links/DEV006-md-links/src/pruebas/prueba2.md')

const arrayLinks = [{
    href: 'ttps://nodejs.org/es/',
    text: 'Node.js',
    fileName: 'C:/Users/cuc22/Documents/Laboratoria/MD-Links/DEV006-md-links/src/pruebas/prueba2.md'},
{
    href: 'https://developers.google.com/v8/',
    text: 'motor de JavaScript V8 de Chrome',
    fileName: 'C:/Users/cuc22/Documents/Laboratoria/MD-Links/DEV006-md-links/src/pruebas/prueba2.md'}
];

// verifyLinks(arrayLinks)
//   .then((results) => {
//     console.log(results);
//   })
//   .catch((error) => {
//     console.error(error);
//   });

module.exports = {
            validateFile,
            readTextFile,
            isAFile,
            isAbsolute,
            absolutePath,
            validateMd,
            isADirectory,
            readDirectory,
            extractLinks,
            verifyLinks
        };