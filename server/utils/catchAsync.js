
/**handles async routes handlers
* @return the function so that it would be executed only when the route is called */ 
module.exports = fn => {
    return (req, res, next) => {
      fn(req, res, next).catch(next);
    };
  };