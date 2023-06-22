const fs = require ('fs');
const readLine = require ('readline');

function readFile(file){
  return new Promise((resolve, reject)=>{
    const lines = [];
    const reader = readLine.createInterface({
      input: fs.createReadStream(file),
      output: process.stdout,
      terminal: false
    });

    const markdownLinkRegex = /\((http[s]?:\/\/[^)]+)\)/gi; // Expresion Regular para ver si es link 

    reader.on('line',(line) =>{
      let matches = line.matchAll(markdownLinkRegex);
      for (let match of matches) {
        lines.push(match[1]); // El primer grupo de captura contiene la URL
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