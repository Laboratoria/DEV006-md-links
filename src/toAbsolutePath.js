const path = require('path');


const toAbsolutePath = (route) => {
  if (path.isAbsolute(route)) {
    return route;
  } else {
    return path.resolve(route);
  }
}


module.exports = {
  toAbsolutePath
}