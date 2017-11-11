const fetch = require('node-fetch');

module.exports.query = (message, callback) => {
  let {url, method, headers, body} = message;
  method = method || 'GET';
  headers = headers || {};
  console.log('FETCH SEND');
  fetch(url, {method, body, headers})
    .then(async result => {
      console.log('FETCH RECEIVE')
      //console.log(result.status)
      callback(null, {
        status: result.status,
        body: await result.text(),
      });

    })
    .catch(err => callback(err));
};
