const { mdLinks } = require('../index.js');
const { isValidPath,isAbsolute, getFilesInDirectory }= require('../functions.js')

const filePath ="./prueba.md"; /*"C:Users\\mabelle\\DEV006-md-links\\prueba.md"*/
const options = { validate: true };

describe("isAbsolute",()=>{
  it("is function",()=>{
    expect(typeof isAbsolute).toBe("function");
  })
});

describe("IsValidPath", () => {
  it("is function", () => {
    expect(typeof isValidPath).toBe("function");
  });
});

describe("getFilesInDirectory",()=>{
  it("deberia retornar los archivos con extensión md",()=>{
    const directoryPath = "./prueba.md";
    getFilesInDirectory(directoryPath)
       .then((result)=>{
        expect(result).toEqual(filePath);
        

       })
    
  })
});



describe("mdLinks", () => {
  it("deberia retornar una promesa que se resuelve con un array de objetos", () => {
   const result =mdLinks(filePath, options);
    expect(result).resolves.toEqual([
        {
          texto: "Markdown",
          href: "https://es.wikipedia.org/wiki/Markdown",
          path: "C:\\Users\\mabelle\\DEV006-md-links\\prueba.md",
          status: 200,
          statusText: "OK",
        },
        
      ]) 
  });
});

