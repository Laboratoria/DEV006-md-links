const fs = require ('fs');

function validatePath(path){
  try{
    if(!fs.existsSync(path)){
      console.log("The path does not exist.")
      return false;
    }
    return true;
  } catch (error){
    console.error(`An error occurred: ${error}`);
    return false;
  }
}

module.exports = {
  validatePath
}
