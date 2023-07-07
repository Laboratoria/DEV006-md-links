function verifyLinks (links){
  const arrayPromise = links.map((link)=>{
    return new Promise((resolve, reject)=>{
      //console.log(link);
      fetch(link.href).then((response)=>{
        resolve({
          ...link,
          code: response.status,
          status: response.status === 200 ? 'OK' : 'FAIL',
        })
      }).catch((error)=>{
        resolve({
          ...link,
          code : error.name,
          status: error.message,
        })
      })
    })
  })

  return Promise.all(arrayPromise);
}

module.exports = {
  verifyLinks
}
