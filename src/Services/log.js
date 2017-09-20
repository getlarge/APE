module.exports.log = function(message, callback) {
  console.log(message.title || 'LOG:', message.input);
  callback(null, message.input);
};
