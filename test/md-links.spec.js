
const fs = require('fs');
const {validatePath} = require ('../src/validatePath');
const { isDirectory } = require('../src/isDirectory');
const { readDirectory } = require('../src/readDirectory'); 

//VALIDATEPATH
  describe('validatePath', () => {
    it('si la ruta no existe deberia returnar false', () => {
      const path = './files/probando123.md';
      expect(validatePath(path)).toBe(false);
    });

    it('si la ruta existe deberia returnar true', () => {
      const path = './files/probando.md';
      expect(validatePath(path)).toBe(true);
    });
  });


// ISDIRECTORY
// Mock fs.lstatSync
fs.lstatSync = jest.fn();

describe('isDirectory', () => {
  it('retorna verdadero si la ruta es un directorio', () => {
    // Define el comportamiento de fs.lstatSync para este caso de prueba
    fs.lstatSync.mockReturnValueOnce({
      isDirectory: () => true,
    });
    
    const path = '/path/to/directory';
    expect(isDirectory(path)).toBe(true);
  });

  it('retorna falso si la ruta no es un directorio', () => {
    fs.lstatSync.mockReturnValueOnce({
      isDirectory: () => false,
    });

    const path = '/path/to/file';
    expect(isDirectory(path)).toBe(false);
  });

  it('Retorna falso si la ruta no existe', () => {
    // Simula un error al intentar acceder a la ruta
    fs.lstatSync.mockImplementationOnce(() => {
      throw new Error();
    });

    const path = '/path/to/non/existent/directory';
    expect(isDirectory(path)).toBe(false);
  });
});


//READDIRECTORY
// Mock fs.readdir
fs.readdir = jest.fn();

describe('readDirectory', () => {
  it('Devuelve una lista de archivos en el directorio', () => {
    // Define el comportamiento de fs.readdir para este caso de prueba
    fs.readdir.mockImplementationOnce((path, encoding, callback) => callback(null, ['file1', 'file2']));
    const path = '/path/to/directory';
    return expect(readDirectory(path)).resolves.toEqual(['file1', 'file2']);
  });

  it('rechaza con un error si la ruta no existe', () => {
    // Simula un error al intentar leer la ruta
    fs.readdir.mockImplementationOnce((path, encoding, callback) => callback(new Error('Directory does not exist')));

    const path = '/path/to/non/existent/directory';
    return expect(readDirectory(path)).rejects.toThrow('Directory does not exist');
  });
});

//READFILE