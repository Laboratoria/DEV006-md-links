
const args = process.argv.slice(2);


let suma = 0;

for (let i = 0; i < args.length; i++) {
  const numero = parseFloat(args[i]);

  if (!isNaN(numero)) {
    suma += numero;
  }
}

console.log(suma);