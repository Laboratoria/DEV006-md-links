const path = require('path');
const fs = require('fs');
const { markAsUntransferable } = require('worker_threads');
const { JSDOM } = require('jsdom');
const MarkdownIt = require('markdown-it');
const { error } = require('console');
const axios = require('axios');


// Valida el archivo
function validateFile(filePath) {
    return fs.existsSync(filePath);
}

// Valida si la ruta es absoluta 
const isAbsolute = (filePath) => path.isAbsolute(filePath); //isAbsolute

//Convierte la ruta relativa a absoluta
const absolutePath = (filePath) => path.resolve(filePath);

//Es un archivo
const isAFile = (filePath) => {
    return fs.statSync(filePath).isFile();
};

// Revisa si es un directorio
const isADirectory = (filePath) => fs.statSync(filePath).isDirectory();

//Leer archivos de un directorio de manera recursiva. si se encuentra un subdirectorio dentro del directorio actual, se llama recursivamente a la función readDirectory para obtener los archivos Markdown dentro del subdirectorio. Luego, los archivos encontrados tanto en el directorio actual como en los subdirectorios se agregan al mismo array (arrayMd). Al final, se resuelve la promesa con el array completo.
const readDirectory = (filePath) => {
    return new Promise ((resolve, reject) =>{
        fs.readdir(filePath, "utf-8", (error, routes) =>{
            if (error){
                reject(error);
            } else{
                const arrayMd = [];
                routes.forEach((file) =>{
                    //const resultExt = path.extname(file);
                    const fileAbsolutePath = path.join(filePath, file);
                    if (fs.statSync(fileAbsolutePath).isFile() && validateMd(fileAbsolutePath)){
                        arrayMd.push(fileAbsolutePath);
                    }

                        else if (isADirectory(fileAbsolutePath)){
                            const subdirectoryFiles =readDirectory(fileAbsolutePath);
                            arrayMd.push(...subdirectoryFiles);
                        }
                });
                resolve(arrayMd);
                console.log(arrayMd, 'Estos son los archivos Markdown');
            }
        });
    });
};

//Lee el archivo
const readTextFile = (filePath) => {
    return new Promise((resolve, reject) => {
        fs.readFile(filePath, 'utf-8', (error, data) => {
            if (error) {
                reject(error);
            } else {
                resolve(data);
                console.log(data);
                
            }
    });
});
};

// Valida si la extensión es .md
const validateMd = (filePath) => { // isMd
    const extension = path.extname(filePath);
    if (extension === '.md') {
        return true;
    } else {
        return false;
    }
};

// Revisa si hay links dentro del archivo y los extrae 

const extractLinks = (data, fileName) =>{
    const allLinks = [];
    const mdRender = MarkdownIt();
    const renderHtml = mdRender.render(data);
    const dom = new JSDOM(renderHtml);
    const { document } = dom.window;
    const links = document.querySelectorAll('a');
    links.forEach((link) => {
        const href = link.getAttribute('href');
        const text = link.textContent.slice(0, 50);
        if (href.startsWith('https://') || href.startsWith('http://')) {
            //allLinks.push({ href, text, fileName});
            allLinks.push({ 
                Ruta: fileName,
                Texto: text, 
                Link: href
                //Codigo: null,
                //Estado: null  
            });
        }
    });
    return (allLinks);

};

// Verifica si son vàlidos los links
const verifyLinks = (links) => {
    //console.log(links);
    const arrayPromise = links.map((link) => {
        return new Promise((resolve, reject) => {
            //fetch(link.href)
            //fetch(link.Link)
            //return global.fetch(link.href)
            axios
                .get(link.Link)
                .then((response) =>{
                    const arrayResult ={
                        Ruta:link.Ruta,
                        Texto: link.Texto,
                        Link: link.Link,
                        Codigo: response.status, //=== 200 ? 200 : 404,
                        Estado: response.statusText //=== 200 ? 'OK' : 'FAIL',
                    };
                    resolve(arrayResult);
                })
                .catch((error) =>{
                    const arrayResult = {
                        // Ruta: link.fileName,
                        // Texto: link.text,
                        // Link:link.href,
                        // //Codigo: error.name,
                        // Codigo: error.name,
                        // Estado: error.message, 
                        Ruta: link.Ruta,
                        Texto: link.Texto,
                        Link:link.Link,
                        //Codigo: error.name,
                        Codigo: null,
                        Estado: 'No se pudo acceder al enlace', 
                    };
                    resolve(arrayResult);
                    //reject(result);
                });
        });
    });
    
    return Promise.all(arrayPromise);
};

// const arrayLinks = [{
//     href: 'ttps://nodejs.org/es/',
//     text: 'Node.js',
//     fileName: 'C:/Users/cuc22/Documents/Laboratoria/MD-Links/DEV006-md-links/src/pruebas/prueba2.md'},
// {
//     href: 'https://developers.google.com/v8/',
//     text: 'motor de JavaScript V8 de Chrome',
//     fileName: 'C:/Users/cuc22/Documents/Laboratoria/MD-Links/DEV006-md-links/src/pruebas/prueba2.md'}
// ];

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