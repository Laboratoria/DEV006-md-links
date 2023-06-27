const   { 
    isAbsolute,
    absolutePath,
    validateFile,
    extractLinks, 
    validateMd,
    isAFile,
    isADirectory,
    readDirectory,
    verifyLinks,
    readTextFile
        } = require("./functions");

function mdLinks(path,options){
    return new Promise(function (resolve, reject){
        const resolveIsAbsolute = isAbsolute(path) ? path : absolutePath(path);
        //console.log(resolveIsAbsolute,'absolute');
        if (validateFile(resolveIsAbsolute)){
            console.log(validateFile,'validatefile');
            if (isAFile(resolveIsAbsolute)){
                console.log('Is a file');
                const resultIsMd = validateMd(resolveIsAbsolute);
                console.log(resultIsMd, 'Este One');
                if(resultIsMd === false){
                    reject('Error: No es un archivo .md');
                }
                readTextFile(resolveIsAbsolute)
                //console.log(result,'result de readtextfile')
                .then((result) => {
                    //console.log(result,'result');
                    const extract = extractLinks(result, resolveIsAbsolute);
                    console.log(extract, 'extract');
                    if (options.validate === false){
                        resolve(extract);
                    }    
                        else{
                        //resolve(verifyLinks(extract))
                        verifyLinks(extract)
                        .then((results) =>{
                            const errors = results.filter((result) => result.Codigo !== 200);
                            if (errors.length > 0) {
                                console.log('Los siguientes enlaces son los inválidos:');
                                errors.forEach((error) => {
                                    console.log(`- Ruta: ${error.Ruta}`);
                                    console.log(`  Texto: ${error.Texto}`);
                                    console.log(`  Enlace: ${error.Link}`);
                                    console.log(`  Código: ${error.Codigo}`);
                                    console.log(`  Estado: ${error.Estado}`);
                                });
                            }
                            resolve(errors);
                        })
                        .catch(reject);
                    }
                })
                .catch(reject);
                }

                if (isADirectory(resolveIsAbsolute)){
                    readDirectory(resolveIsAbsolute)
                    .then((result)=>{
                        const promises = result.map((link) =>
                        readTextFile(link).then((result)=>{
                            const extract = extractLinks(result, link);
                            if (options.validate === false){
                                console.log(extract,'extract de directory');
                                return extract;
                                
                            } else {
                                return verifyLinks(extract);
                            }
                        })
                        .catch(reject)
                        );
                        Promise.all(promises)
                        .then ((results) =>{
                            const flatAllResults = results.flat();
                            resolve(flatAllResults);
                            console.log(flatAllResults, 'flat results');
                        })
                        .catch (reject);
                    })
                    .catch (reject);
                }
            }
            else{
                reject('La ruta no existe');
            }
    });
}

const path = ('pruebas');
const options = {validate: false};
const resultFunction = mdLinks(path, options);
console.log(resultFunction, 'Resultado de la función!');
resultFunction
.then(function (result) {
    console.log(result, 'Es este...')
})
.catch(
    function (error) {
    console.log(error)
});