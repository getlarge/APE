module.exports.getService = (choice) => {
	console.log('RETURN', choice);
    return function(context, next) {
      console.log('RUN', choice);
    }
};