const {
  isAbsolute,
  relativeToAbsolute,
  isValidPath,
  isFile,
  getFilesInDirectory,
  readFileMd,  
  validateMd,
} = require("./functions.js");

const filePath = process.argv[2];



function mdLinks (path, options){
  return new Promise ((resolve,reject) =>{
    let absolutePath;
    const validateLinks=isAbsolute(path); //valida si la ruta es absoluta
    if(validateLinks){
      absolutePath=path;
    }else {
      absolutePath=relativeToAbsolute(filePath); //convierte una ruta relativa a absoluta
      
    }

    isValidPath (absolutePath) //la ruta es valida
         .then((isValid)=>{
          if(!isValid){
            reject(new Error("La ruta no es válida"));
          }
          return isFile(absolutePath); //es archivo
         })
         .then((isFile)=>{
          if(!isFile){   //es archivo o directorio?
            console.log("Es directorio");
            return getFilesInDirectory(absolutePath);// obtiene los archivos del directorio
          }
           console.log("Es archivo");
           return readFileMd(absolutePath);//busca archivos md
         })
         .then((links)=>{
          if (options && options.validate) {
            return validateMd(links);//retorna enlaces validados
          }

          return links;  

         })
         .then((result)=>{
          resolve(result);//aqui se resulve la promesa
         })
         .catch((error)=>{
           reject(error);//aqui se rechaza la promesa 
         });        
         
  });
  
}


        

const result = mdLinks(filePath, { validate: true });
result
  .then((res) => {
    console.log("identificar aqui ****",res );
    return res;
  })
  .catch((err) => {
    //console.error(err);
    return err;
  });

module.exports = {
  mdLinks,
};
