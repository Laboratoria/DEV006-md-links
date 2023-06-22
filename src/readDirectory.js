const fs = require ('fs');


function readDirectory(file){
  return new Promise((resolve, reject)=>{
    const archives = [];
    fs.readdir(file, 'utf8', (error, files) => {
      if(error){
        reject(error);
      } else {
        resolve(files)
      }
    })
    //archives.push('archivo1');
  })
  
}

module.exports = {
  readDirectory
}