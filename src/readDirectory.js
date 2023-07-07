const fs = require ('fs');


function readDirectory(file){
  return new Promise((resolve, reject)=>{
    fs.readdir(file, 'utf8', (error, files) => {
      if(error){
        reject(error);
      } else {
        resolve(files)
      }
    })
  })
  
}

module.exports = {
  readDirectory
}