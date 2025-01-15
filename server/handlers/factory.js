// mostly get all handlers
const User = require('../models/users/User');
const AppError = require('../utils/AppError')

/**
 * a generic handler for getting many documents with a given query and a select string
 * @param Model - the model to query on
 * @param filterCallback - a function that gets the request object and returns the filter object for the query, defaulted to empty object
 * @param select - a string of which fields to select in the query
 * - response with the docs of the Model if successful, otherwise throws a 404 error 
 */
exports.getAll = (Model, filterCallback = () => ({}), select= null) =>(
    catchAsync(async (req, res, next)=>{

        let query = Model.find(filterCallback(req));

        // Apply select only if it is not null
        if (select) {
            query = query.select(select);
        }

        // Execute the query
        const docs = await query;
        if(!docs){
            return next(new AppError('לא נמצאו מסמכים מתאימים'), 404)
        }
        res.status(200).json({status: "success", docs})
    }))

 
    /**
 * a generic handler for getting one document with a given id and a select string
 * @param Model - the model to query on
 * @param filterCallback - a function that gets the request object and returns the filter object for the query, defaulted to empty object
 * @param select - a string of which fields to select in the query
 * - response with the doc of the Model if successful, otherwise throws a 404 error 
 */
    exports.getOne = (Model, filterCallback = () => ({}), select= null) =>(
        catchAsync(async (req, res, next)=>{

            let query = Model.findById(filterCallback(req));

            if (select){
                query = query.select(select);
            }

            const doc = await query;
            if(!doc){
                return next(new AppError('לא נמצאו מסמכים מתאימים'), 404)
            }
            res.status(200).json({status: "success", doc})
        }))



