module.exports.wait = function(message, callback) {
  setTimeout(() => callback(null, true), message.delay * 1000);
};
