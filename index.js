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


function mdLinks (path){
  return new Promise ((resolve,reject) =>{
    let absolutePath;
    const validateLinks=isAbsolute(path); //valida si la ruta es absoluta
    if(validateLinks){
      absolutePath=path;
    }else {
      absolutePath=relativeToAbsolute(filePath); //convierte una ruta relativa a absoluta
      
    }

    isValidPath (absolutePath)
         .then((isValid)=>{
          console.log('la ruta es válida:', isValid); //valida si la ruta existe(es valida)
          resolve(isValid);
         })
         .catch((err)=>{
          console.log ("la ruta no es válida",err);
          reject(err);
         });
        
        isFile(absolutePath)
          .then((isFile)=>{
            if(isFile){
              console.log("es archivo")
              resolve(isFile);
            }else{
              console.log("es directorio")
              getFilesInDirectory(absolutePath)
              .then((filePaths)=>{
                console.log("archivos disponibles");
                //console.log(filePaths)
                resolve(filePaths); 
            })              
              .catch((error)=>{
                console.log("Error:No tiene archivos de extensión .md", error);
                reject(error); 

              });
            };
          })
          .catch((error)=>{
            console.log("Error:no es archivo", error);
            reject(error); 
          });
       readFileMd(absolutePath)
       .then((links) => {
         //console.log("funciona hasta readfilemd");
         validateMd(links)
           .then((validatedLinks) => {
             console.log("Enlaces validados:", validatedLinks);             
             resolve(validatedLinks);
           })
           .catch((error) => {
             console.log("Error en la validación de enlaces:", error);
             reject(error);
           });
       });
         
         
  });
  
}


mdLinks(filePath)
.then((res)=>console.log(res, "identificar aqui ****"))
.catch((err)=>console.log(err));


