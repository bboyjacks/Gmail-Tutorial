const Request = (() => {
  const get = url => {
    return new Promise((resolve, reject) => {
      fetch(url)
        .then(resp => {
          return resp.text();
        })
        .then(html => {
          resolve(html);
        })
        .catch(err => {
          reject(err);
        });
    });
  };
  return {
    get: get
  };
})();
