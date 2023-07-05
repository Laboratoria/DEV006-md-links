const { mdLinks } = require('../src/index.js');
const fs = require('fs');
//const path = require('path');
const { JSDOM } = require('jsdom');
const MarkdownIt = require ('markdown-it'); 
const { validateFile,
        isAbsolute,
        extractLinks,
        verifyLinks,
        readTextFile 
      } = require ('../src/functions'); 

const path = 'C:\\Users\\cuc22\\Documents\\Laboratoria\\MD-Links\\DEV006-md-links\\src\\pruebas\\prueba1.md';
const options = { validate: true};
const axios = require ('axios');

describe('mdLinks', () => {
  it('debería retornar una promesa que se resuelve con un array de objetos', async() => {
    const result = mdLinks(path, options);
    await expect(result).resolves.toEqual([
      {
        Ruta: 'C:\\Users\\cuc22\\Documents\\Laboratoria\\MD-Links\\DEV006-md-links\\src\\pruebas\\prueba1.md',
        Texto: 'Hotmail',
        Link: 'http://www.hotmailll.com/',
        Codigo: null,
        Estado: 'No se pudo acceder al enlace'
      },
      {
        Ruta: 'C:\\Users\\cuc22\\Documents\\Laboratoria\\MD-Links\\DEV006-md-links\\src\\pruebas\\prueba1.md',
        Texto: 'Youtube',
        Link: 'https://www.youtubeeee.com/',
        Codigo: null,
        Estado: 'No se pudo acceder al enlace'
      },
      {
        Ruta: 'C:\\Users\\cuc22\\Documents\\Laboratoria\\MD-Links\\DEV006-md-links\\src\\pruebas\\prueba1.md',
        Texto: 'Google',
        Link: 'http://www.google.com/',
        Codigo: 200,
        Estado: 'OK'
      }
      ])//.then(done);
  });
});

// Validar **si existe** el archivo
describe ('validateFile',  () =>{
  test ('Deberá retornar True si el archivo existe', () =>{
  const filePath = 'C:\\Users\\cuc22\\Documents\\Laboratoria\\MD-Links\\DEV006-md-links\\src\\pruebas\\prueba1.md';
  const result = validateFile(filePath);
  expect(result).toBe(true);  
  });
  test ('Deberá retornar False si el archivo no existe', () =>{
  const filePath = '..\src\pruebas\prueba1.md';  
  const result = validateFile(filePath);
  expect(result).toBe(false);
});
});

// Validar si la ruta **es absoluta**
describe ('isAbsolute', () =>{
  test('Deberá retornar true si la ruta es absoluta', () =>{
    const filePath = 'C:\\Users\\cuc22\\Documents\\Laboratoria\\MD-Links\\DEV006-md-links\\src\\pruebas\\prueba1.md';
    const result = isAbsolute(filePath);
    expect(result).toBe(true);
  });
  test('Deberá retornar false si la ruta no es absoluta', () =>{
    const filePath = '\src\pruebas\prueba1.md';
    const result = isAbsolute(filePath);
    expect(result).toBe(false);
});
});

// Validar la función **extractLinks** con mocks de la dependencia 'jsdom'
// Este mock se utiliza para simular el comportamiento de un navegador en un entorno de prueba
  jest.mock('jsdom', () => ({
    JSDOM: jest.fn().mockImplementation(() => {
      const mockDom ={
        window: {
          document: {
            querySelectorAll: jest.fn().mockReturnValue([   // Se simula la respuesta de la función querySelectorAll que devuelve un array de objetos con dos propiedades: getAttribute y textContent.
              { getAttribute: jest.fn().mockReturnValue('http://www.hotmailll.com/'), textContent: 'Hotmail' }, //Estas propiedades se utilizan para simular los enlaces encontrados en un archivo Markdown.
              { getAttribute: jest.fn().mockReturnValue('https://www.youtubeeee.com/'), textContent: 'Youtube' },//getAttribute y textContent se utilizan para obtener los valores de los enlaces encontrados en el archivo Markdown.
              { getAttribute: jest.fn().mockReturnValue('http://www.google.com/'), textContent: 'Google' },
            ]),
          },
        },
      };
      return mockDom;
    }),
  }));

  // Mock de la dependencia  markdown-it(Convierte texto escrito en Markdown a HTMLpara ser visualizado en un navegador web)
  // la función 'extractLinks' utiliza la dependencia 'markdown-it' para analizar el archivo Markdown y extraer los enlaces que contiene. 
  // Luego, utiliza la dependencia 'jsdom' para simular el comportamiento de un navegador y obtener información sobre los enlaces encontrados. 
  // Finalmente, devuelve un array de objetos que contienen información sobre cada enlace, como la URL, el texto y el nombre del archivo donde se encontró el enlace.
   jest.mock('markdown-it', () => jest.fn().mockImplementation(() => ({ // mockImplementation se utiliza para simular rl comportamiento de la dependencia 'jsdom' probando el código sin tener que depender del comportamiento real del navegador.
      render: jest.fn().mockReturnValue('<a href="http://www.hotmailll.com/">Hotmail</a><a href="https://www.youtubeeee.com/">Youtube</a><a href="http://www.google.com/">Google</a>'),
    })));

    describe ('extractLinks', () => {
      test ('Deberá extraer los enlaces correctamente', () =>{
        const data = 'Algo de texto';
        const fileName = 'src/pruebas/prueba2.md';

        const result= extractLinks(data, fileName);
        expect(result).toEqual([ //Verifica que el resultado de la función sea igual al objeto esperado
          { Link: 'http://www.hotmailll.com/', Texto: 'Hotmail', Ruta: 'src/pruebas/prueba2.md'},
          { Link: 'https://www.youtubeeee.com/', Texto:'Youtube', Ruta: 'src/pruebas/prueba2.md'},
          { Link: 'http://www.google.com/', Texto:'Google', Ruta: 'src/pruebas/prueba2.md'},
        ]);
      });
    });

    // // Validar la función **verifyLinks**
    //  const axios = require('axios');
    //   jest.mock('axios'); // Crea un mock para axios.get
    //   test('verifyLinks retorna un array de links con su validación', async () =>{
    //    // Define los enlaces de prueba
    //   const links = [
    //     {
    //       Ruta: 'C:\\Users\\cuc22\\Documents\\Laboratoria\\MD-Links\\DEV006-md-links\\src\\pruebas\\prueba1.md',
    //       Texto: 'Hotmail',
    //       Link: 'http://www.hotmailll.com/'
    //     },
    //     {
    //       Ruta: 'C:\\Users\\cuc22\\Documents\\Laboratoria\\MD-Links\\DEV006-md-links\\src\\pruebas\\prueba1.md',
    //       Texto: 'Youtube',
    //       Link: 'https://www.youtubeeee.com/'
    //     },
    //     {
    //       Ruta: 'C:\\Users\\cuc22\\Documents\\Laboratoria\\MD-Links\\DEV006-md-links\\src\\pruebas\\prueba1.md',
    //       Texto: 'Google',
    //       Link: 'http://www.google.com/'
    //     }
    //   ];
    //   // Define los resultados esperados
    //   const expectedResults = [
    //     {
    //       Ruta: 'C:\\Users\\cuc22\\Documents\\Laboratoria\\MD-Links\\DEV006-md-links\\src\\pruebas\\prueba1.md',
    //       Texto: 'Hotmail',
    //       Link: 'http://www.hotmailll.com/',
    //       Codigo: null,
    //       Estado: 'No se pudo acceder al enlace'
    //     },
    //     {
    //       Ruta: 'C:\\Users\\cuc22\\Documents\\Laboratoria\\MD-Links\\DEV006-md-links\\src\\pruebas\\prueba1.md',
    //       Texto: 'Youtube',
    //       Link: 'https://www.youtubeeee.com/',
    //       Codigo: null,
    //       Estado: 'No se pudo acceder al enlace'
    //     },
    //     {
    //       Ruta: 'C:\\Users\\cuc22\\Documents\\Laboratoria\\MD-Links\\DEV006-md-links\\src\\pruebas\\prueba1.md',
    //       Texto: 'Google',
    //       Link: 'http://www.google.com/',
    //       Codigo: 200,
    //       Estado: 'OK'
    //     }
    //   ];
    //   //Configura el mock de axios.get para simular respuestas exitosas o fallidas
    //     axios.get.mockImplementation((url) =>{
    //       if (url === 'http://www.hotmailll.com/') {
    //         return Promise.reject({Ruta: 'C:\\Users\\cuc22\\Documents\\Laboratoria\\MD-Links\\DEV006-md-links\\src\\pruebas\\prueba1.md', Texto: 'Hotmail', Link: 'http://www.hotmailll.com/', Codigo: null, Estado: 'No se pudo acceder al enlace'});
    //     } else if (url === 'https://www.youtubeeee.com/') {
    //       return Promise.reject({Ruta: 'C:\\Users\\cuc22\\Documents\\Laboratoria\\MD-Links\\DEV006-md-links\\src\\pruebas\\prueba1.md', Texto: 'Youtube', Link: 'https://www.youtubeeee.com/', Codigo: null, Estado: 'No se pudo acceder al enlace'});
    //       } else if (url === 'http://www.google.com/'){
    //       return Promise.resolve({Ruta: 'C:\\Users\\cuc22\\Documents\\Laboratoria\\MD-Links\\DEV006-md-links\\src\\pruebas\\prueba1.md', Texto: 'Google', Link: 'http://www.google.com/', Codigo: 200, Estado: 'OK'});
    //       }
    //     });
    //     // Ejecuta la función verifyLinks
    //     const results = await verifyLinks(links);
    //     //Verifica que los resultados sean los esperados
    //     expect(results).toEqual(expectedResults);       
    // });
 
//Test de función **verifyLinks**
const verifyLinksTest = (links) =>{
  const arrayPromise = links.map((link)=> {
    //axios.get(link.Link)
    return axios
    .get(link.Link)
    .then ((response) => ({
      Ruta: link.Ruta,
      Texto: link.Texto,
      Link: link.Link,
      Codigo: response.status,
      Estado: response.statusText
    }))
    .catch((error) => ({
      Ruta: link.Ruta,
      Texto: link.Texto,
      Link: link.Link,
      Codigo: null,
      Estado: 'No se pudo acceder al enlace'
    }));
});
  return Promise.all(arrayPromise);
  };
  //Define una función de prueba para verifyLinks
  const testVerifyLinks = async () => {
    const links = [
      { Ruta: 'C:\\Users\\cuc22\\Documents\\Laboratoria\\MD-Links\\DEV006-md-links\\src\\pruebas\\prueba1.md', Texto: 'Hotmail', Link: 'http://www.hotmailll.com/'},
      { Ruta: 'C:\\Users\\cuc22\\Documents\\Laboratoria\\MD-Links\\DEV006-md-links\\src\\pruebas\\prueba1.md', Texto: 'Youtube', Link: 'https://www.youtubeeee.com/'},
      { Ruta: 'C:\\Users\\cuc22\\Documents\\Laboratoria\\MD-Links\\DEV006-md-links\\src\\pruebas\\prueba1.md', Texto: 'Google', Link: 'http://www.google.com/'},
    ];
    const results = await verifyLinksTest(links);
    //console.log(results);
  };
// Ejecuta la prueba 
  testVerifyLinks();

// Test de función readTextFile
const { promisify } = require('util');
const readTextAsync = promisify(fs.readFile);
describe('readTextFile', () => {
  test('Debe leer el archivo de texto y resolver con el contenido del archivo', () => {
    const filePath = 'C:\\Users\\cuc22\\Documents\\Laboratoria\\MD-Links\\DEV006-md-links\\src\\pruebas\\prueba1.md';
    const expectedContent = '[Hotmail](http://www.hotmailll.com/)\n[Youtube](https://www.youtubeeee.com/)\n[Google](http://www.google.com/)';
   

    return readTextFile(filePath)
    .then((content) => {
      const normalizedContent = content.replace(/\r\n/g, '\n'); // Normaliza el formato de las nuevas líneas para evitar discrepancias
      expect(normalizedContent).toEqual(expectedContent);
    });
  });

  test('Debe rechazar con un error si el archivo no existe', () =>{
    const filePath = 'src\pruebas\prueba3.md';
    return readTextFile(filePath)
    .catch((error) => {
      expect(error).toBeDefined();
    });
  });
});