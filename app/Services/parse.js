const _ = require('lodash');

module.exports.parse = (message, callback) => {
  let {type, search, body} = message;
  type = type || 'json';
  try {
    switch (type) {
      case 'json':
        console.log(body);
        body = JSON.parse(body);
        callback(null, _.get(body, search));
        return;
    }
  } catch (err) {
    callback(err);
  }
};
