
const fs = require('fs');
const path = require ('path');
require('jest-fetch-mock').enableMocks();
const {validatePath} = require ('../src/validatePath');
const { isDirectory } = require('../src/isDirectory');
const { readDirectory } = require('../src/readDirectory');
const { readFile } = require('../src/readFile');
const { verifyLinks } = require('../src/verifyLinks')
const { mdLinks } = require('../src/mdLinks');

//VALIDATEPATH
  describe('validatePath', () => {
    it('si la ruta no existe deberia returnar false', () => {
      const path = './files/probando123.md';
      expect(validatePath(path)).toBe(false);
    });

    it('si la ruta existe deberia returnar true', () => {
      const file = path.join(__dirname, 'probando.md');
      //const path = './probando.md';
      expect(validatePath(file)).toBe(true);
    });
  });

//ISDIRECTORY
  describe('isDirectory', () => {
    it('Devuelve true si la ruta es un directorio', () => {
      const directoryPath = path.join(__dirname, '../routes/files/');

      expect(isDirectory(directoryPath)).toBe(true);
    });

    it('Devuelve false si la ruta no es un directorio', () => {
      const filePath = path.join(__dirname, '../routes/archivo2.md');

      expect(isDirectory(filePath)).toBe(false);
    });

    it('returns false if the path does not exist', () => {
      const nonExistentPath = '/path/non/existent/directory';

      expect(isDirectory(nonExistentPath)).toBe(false);
    });
  });


// READDIRECTORY
describe('readDirectory', () => {
  it('devuelve una lista de archivos en el directorio', () => {
    const testDir = path.join(__dirname, '../routes/files/');

    return readDirectory(testDir)
      .then(files => {
        expect(files).toEqual(expect.arrayContaining(['asinlinks.md', 'probando.md']));
      });
  });

  it('rechaza con un error si la ruta no existe', () => {
    const nonExistentPath = '/path/non/existent/directory';

    return expect(readDirectory(nonExistentPath)).rejects.toThrow();
  });
});


//READFILE
describe('readFile', () => {
  it('lee un archivo markdown y extrae los links', () => {
    const file = path.join(__dirname, 'asinlinks.md');

    const expectedLinks = [
      {
        href: 'https://es.wikipedia.org/wiki/Markdown',
        name: 'asinlinks.md',
        text: 'Markdown',
      },
      {
        href: 'https://nodejs.org/',
        name: 'asinlinks.md',
        text: 'Node.js',
      },
    ];

    return expect(readFile(file)).resolves.toEqual(expectedLinks);
  });

  it('rechaza con un error por un archivo inexistente', () => {
    const nonExistingFile = path.join(__dirname, 'non_existing_file.md');
    return expect(readFile(nonExistingFile)).rejects.toThrow();
  });
});

//VERIFYLINKS
describe('verifyLinks', () => {
  it('verifica el estado de los enlaces', async () => {
    const links = [
      { href: 'https://nodejs.org/', text: 'Node.js' },
      { href: 'https://github.com/Laboratoria/course-parser458', text: 'course-parser' },
    ];

    // Define las respuestas de fetch
    fetchMock.mockResponses(
      [JSON.stringify({}), { status: 200 }],
      [JSON.stringify({}), { status: 404 }],
    );

    const result = await verifyLinks(links);
    // Comprueba que la respuesta es la esperada
    expect(result).toEqual([
      { href: 'https://nodejs.org/', text: 'Node.js', code: 200, status: 'OK' },
      { href: 'https://github.com/Laboratoria/course-parser458', text: 'course-parser', code: 404, status: 'FAIL' },
    ]);
  });

  it('maneja los errores de búsqueda', async () => {
    const links = [
      { href: 'https://github.com/Laboratoria/course-parser458', text: 'Error' },
    ];

    // Simula un error de red
    fetchMock.mockRejectOnce(new Error('Network error'));

    const result = await verifyLinks(links);

    // Comprueba que la respuesta es la esperada
    expect(result[0].href).toBe('https://github.com/Laboratoria/course-parser458');
    expect(result[0].text).toBe('Error');
    expect(result[0].code).toBe('Error');
    expect(result[0].status).toBe('Network error');
  });
});

//MDLINKS

describe('mdLinks', () => {
  it('is a function', () => {
    expect(typeof mdLinks).toBe('function');
  });

  it('retorna una promesa', () => {
    const filePath = path.join(__dirname, 'asinlinks.md')
    // Dado que mdLinks es asincrónico, debería devolver una promesa
    const result = mdLinks(filePath, {});
    expect(result).toBeInstanceOf(Promise);
  });

  test('debe rechazar con un error si no se encuentran rutas válidas', () => {
    const pathEj = '/ruta/no/valida';
    return expect(mdLinks(pathEj)).rejects.toThrow( new Error('No se encontraron rutas válidas'));
  });

  it('retorna datos de un link en un archivo markdown ', async () => {
    const filePath = path.join(__dirname, 'asinlinks.md')
    const result = await mdLinks(filePath, { });

    // Verificar que el resultado es un array
    expect(Array.isArray(result)).toBe(true);

    // Verificar que cada elemento del array es un objeto con las propiedades esperadas
    result.forEach(link => {
      expect(link).toMatchObject({
        href: expect.any(String),
        name: expect.any(String),
        text: expect.any(String),
      });
    });
  });

  it('retorna links de un archivo markdown con validate true', async () => {
    const filePath = path.join(__dirname, 'asinlinks.md')
    const result = await mdLinks(filePath, { validate: true });

    // Verificar que el resultado es un array
    expect(Array.isArray(result)).toBe(true);

    // Verificar que cada elemento del array es un objeto con las propiedades esperadas
    result.forEach(link => {
      expect(link).toMatchObject({
        href: expect.any(String),
        name: expect.any(String),
        text: expect.any(String),
        status: expect.any(String),
        code: expect.any(Number),
      });
    });
  });

  it('returns links data for the directory', async () => {
    const filePath = path.join(__dirname, 'directory/');
    const result = await mdLinks(filePath, { });

    expect(result.length).toBe(4)

  })

  it('retorna links de un directorio con validate true', async () => {
    const filePath = path.join(__dirname, 'directory/');
    const result = await mdLinks(filePath, { validate: true });
    expect(result.length).toBe(4)
  })

  it('retorna el error cuando la extensión del archivo no es válida', async () => {
    const filePath = path.join(__dirname, 'invalid-extension.txt');

    expect(mdLinks(filePath, { validate: true })).rejects.toThrow( new Error("La ruta no es un archivo .md ni un directorio"));
  })
});
