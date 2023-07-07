const fs = require ('fs');
const readLine = require ('readline');
const path = require ('path');

function readFile(file){
  const nameFile = path.basename(file);
  return new Promise((resolve, reject)=>{
    const lines = [];
    const reader = readLine.createInterface({
      input: fs.createReadStream(file),
      terminal: false
    });

    const markdownLinkRegex = /\[([^\]]+)\]\((http[s]?:\/\/[^)]+)\)/gi; // Expresion Regular para ver si es link 

    reader.on('line',(line) =>{
      let matches = line.matchAll(markdownLinkRegex);
      for (let match of matches) {
        lines.push({
          href: match[2], // El primer grupo de captura contiene la URL
          name: nameFile,
          text: match[1] 
        }); 
      }
    });

    reader.on('error', (error) => {
      reject(error);
    })

    reader.on('close', () =>{
      resolve(lines)
    })
    
  })
  
}



module.exports = {
  readFile
}