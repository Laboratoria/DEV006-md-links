# MDLinks - Markdown Links

## Índice

* [1. Preámbulo](#1-preámbulo)
* [2. Resumen del proyecto](#2-resumen-del-proyecto)
* [3. Objetivos de aprendizaje](#3-diagrama-de-flujo)
* [4. Consideraciones generales](#4-consideraciones-generales)


***

## 1. Preámbulo

[Markdown] Es un lenguaje de marcado ligero muy popular entre developers. Es usado en muchísimas plataformas que manejan texto plano (GitHub, foros, blogs, ...) y es muy común encontrar varios archivos en ese formato en cualquier tipo de repositorio.

Estos archivos `Markdown` normalmente contienen _links_ (vínculos/ligas) que
muchas veces están rotos o ya no son válidos y eso perjudica mucho el valor de
la información que se quiere compartir.

![md-links](https://user-images.githubusercontent.com/110297/42118443-b7a5f1f0-7bc8-11e8-96ad-9cc5593715a6.jpg)

## 2. Resumen del proyecto

Dentro de una comunidad de código abierto, es importante crear una herramienta usando [Node.js], que lea y analice archivos en formato `Markdown`, para verificar los links que contengan y decir si son válidos o no. Este proyecto MDLinks se trata de eso.

## 3. Diagrama de Flujo

![Diagrama de Flujo](C:\Users\cuc22\Documents\Laboratoria\MD-Links\DEV006-md-links\src\Diagrama de flujo MD Links.png)


## 4. Consideraciones generales

* Este proyecto se debe "resolver" de manera individual.

* El rango de tiempo estimado para completar el proyecto es de 4 a 5 Sprints.

* La **librería** y el **script ejecutable** (herramienta de línea de comando -
  CLI) deben estar implementados en JavaScript para ser ejecutados con
  Node.js. **Está permitido usar librerías externas**.

* Tu módulo **debe ser instalable** via `npm install <github-user>/md-links`. Este
  módulo debe incluir tanto un _ejecutable_ que podamos invocar en la línea de
  comando como una interfaz que podamos importar con `require` para usarlo
  programáticamente.

* Los **tests unitarios** deben cubrir un mínimo del 70% de _statements_,
  _functions_, _lines_ y _branches_. Te recomendamos explorar [Jest](https://jestjs.io/)
  para tus pruebas unitarias.

* Para este proyecto **no está permitido** utilizar `async/await`.

* Para este proyecto te sugerimos **no utilizar** la versión síncrona
  de la función para leer archivos, `readFileSync`, y en cambio intentar
  resolver este desafío de manera asíncrona.

* Para este proyecto es **opcional** el uso de ES Modules `(import/export)`, en el
  caso optes utilizarlo deberás de crear un script de `build` en el `package.json`
  que los transforme en `requires` y `module.exports` con ayuda de **babel**.

* Para disminuir la complejidad de tu algoritmo recursivo, te recomendamos
  utilizar la versión síncrona de la función para leer directorios, `readdirSync`.

