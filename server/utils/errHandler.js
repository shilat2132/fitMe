const AppError = require('./AppError')

/**
 * The global handler for errors, either custom errors or non-custom.
 */
module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500
    err.status = err.status || 'error';

    let error = {...err}
    error.message = err.message;
    error.name = err.name;

    //error type
    if(error.name === 'ValidationError') error = handleValidationErrorDB(error)
    if (error.code === 11000) error = handleDuplicateFieldsDB(error);
    if (error.name === 'JsonWebTokenError') error = handleJWTError();
    if (error.name === 'CastError') error = handleCastErrorDB(error);
    if(error.name === "TypeError") error = handleTypeError(error)


    if (process.env.NODE_ENV === 'development') {
        // console.log(err)
        sendErrorDev(error, req, res);
      }else if (process.env.NODE_ENV === 'production'){
        sendErrorProd(error, req, res)
      }
}


const sendErrorDev = (err, req, res)=>{
        res.status(err.statusCode).json({
            status: err.status,
            error: err,
            message: err.message,
            stack: err.stack
        })
    }

const sendErrorProd = (err, req, res)=>{
    if(err.isOperational){
        return res.status(err.statusCode).json({
            status: err.status,
            message: err.message,
            error: err
        })
    } else{ //if it's not an error i created i want a general error msg
        return res.status(500).json({
            status: 'error',
            message: "something is wrong"
        });
    }
}


const handleValidationErrorDB = error =>{
    const errors = Object.values(error.errors).map(el=> el.message)
    const message = `${errors.join('. ')}`;
    return new AppError(message, 400);
}

const handleDuplicateFieldsDB = error =>{
    const value = error.message.match(/(["'])(\\?.)*?\1/)[0]
    const message = `There is already an existing document with the value of ${value}.`;
    return new AppError(message, 400);
}

const handleJWTError = () =>
  new AppError('You need to log in again', 401);

const handleCastErrorDB = error =>{
    const message = `Invalid ${error.path} : ${error.value}`
    return new AppError(message, 400)
}

const handleTypeError = error=>{
    return new AppError(error.message, 500)
}