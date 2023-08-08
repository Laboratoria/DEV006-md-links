const path = require("path");
const fs = require("fs");
const axios = require("axios");



function isAbsolute(route) {
  return path.isAbsolute(route);
}


function relativeToAbsolute(route) {
  return path.resolve(route);
}

function isValidPath(route) {
  return new Promise((resolve) => {
    fs.access(route, fs.constants.F_OK, (err) => {
      if (err) {
        resolve(false); // La ruta no es válida
      } else {
        resolve(true); // La ruta es válida
      }
    });
  });
}

function isFile(route) {
  return new Promise((resolve, reject) => {
    fs.stat(route, (error, stats) => {
      if (error) {
        reject(error); // Rechaza la promesa con el error
      } else if (stats.isFile()) {
        resolve(true); // Resuelve la promesa como true si es un archivo
      } else if (stats.isDirectory()) {
        resolve(false); // Resuelve la promesa como false si es un directorio
      }
    });
  });
}

function getFilesInDirectory(directoryPath) {
  return new Promise((resolve, reject) => {
    fs.readdir(directoryPath, (err, files) => {
      if (err) {
        reject(err); // Rechaza la promesa si hay un error al leer el directorio
      } else {
        const filePaths = files.map((file) => path.join(directoryPath, file));
        const mdFiles=filePaths.filter((filePath) => path.extname(filePath) === ".md"); //obtener archivos con extension ".md"

        resolve(mdFiles);
      }
    });
  });
}

function readFileMd(fileMd) {
  return new Promise((resolve, reject) => {
    const links = [];
    fs.readFile(fileMd, "utf8", (err, data) => {
      if (err) {
        reject("Error al leer el archivo");
      } else {
        //contiene links? extraelos...
        const regex = /\[(.*)\]\((https?:\/\/[\w\d./?=#]+)\)/g;
        const matches = data.matchAll(regex);
        

        for (const match of matches) {
          const texto = match[1];
          const href = match[2];
          const path = relativeToAbsolute(process.argv[2]);
          links.push({ texto, href,path, });
        }
        
        resolve(links);
      }
    });
  });
}

function validateMd(links) {
  const linkPromises = links.map((link) => {
    return axios.get(link.href)
      .then((response) => {
       
        return {
          ...link,
          status : response.status,
          statusText : "ok"
        };
      })
      .catch((error) => {
        link.status = 404;
        link.statusText = "fail";
      
        return {
          ...link,
          status: error.response.status,
          statusText: "fail",
        };
      });
  });

  return Promise.all(linkPromises);
}




module.exports = {
  isAbsolute,
  relativeToAbsolute,
  isValidPath,
  isFile,
  getFilesInDirectory,
  readFileMd,
  validateMd,
};
