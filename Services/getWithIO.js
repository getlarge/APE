module.exports.getWithIO = (reqOptions, next) => {
    console.log('RUN IO GET', reqOptions.uri, 'with headers', reqOptions.headers);
    next(null, {statusCode:200}, {});
};
   