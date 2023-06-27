const mdLinks = require('../src/index.js');

const path = require('path');
const toAbsolutePath = require('../src/toAbsolutePath.js'); 

describe('toAbsolutePath', () => {
  it('devuelve la misma ruta si la ruta ya es absoluta', () => {
    const absolutePath = path.resolve('/test/path');
    expect(toAbsolutePath(absolutePath)).toBe(absolutePath);
  });

  it('convierte una ruta relativa en una ruta absoluta', () => {
    const relativePath = './test/path';
    const expectedAbsolutePath = path.resolve(relativePath);
    expect(toAbsolutePath(relativePath)).toBe(expectedAbsolutePath);
  });
});


// describe('mdLinks', () => {

//   it('should...', () => {
//     console.log('FIX ME!');
//   });

// });


