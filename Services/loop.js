module.exports.loop = (executionContext, callback) => {
      const prevResult = executionContext.variables.sum ? executionContext.variables.sum : 0;
      const result = prevResult + executionContext.item;
      console.log('prevresult :', prevResult);
      console.log('result :', result);
      callback(null, result);
    };