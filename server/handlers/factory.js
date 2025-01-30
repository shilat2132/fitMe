// mostly get all handlers
const User = require('../models/users/User');
const AppError = require('../utils/AppError')

/**
 * a generic handler for getting many documents with a given query and a select string
 * @param filterCallback - a function that gets the request object and returns the filter object for the query, defaulted to empty object
 * - response with the docs of the Model if successful, otherwise throws a 404 error 
 */
exports.getAll = (Model, filterCallback = () => ({}), select= null, sort = null) =>(
    catchAsync(async (req, res, next)=>{

        let query = Model.find(filterCallback(req));

        // Apply select only if it is not null
        if (select) {
            query = query.select(select);
        }

        if (sort){
            query = query.sort(sort)
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
 * @param filterCallback - a function that gets the request object and returns the id of the doc to be found, defaulted to null
 * - response with the doc of the Model if successful, otherwise throws a 404 error 
 */
    exports.getOne = (Model, filterCallback = () => null, select= null) =>(
        catchAsync(async (req, res, next)=>{

            id = filterCallback(req)
            if (!id){
                throw Error("You have to provide document id")
            }
            let query = Model.findById(id);

            if (select){
                query = query.select(select);
            }
           

            const doc = await query;
            if(!doc){
                return next(new AppError("Couldn't find the document"), 404)
            }
            res.status(200).json({status: "success", doc})
        }))


      /**
 * a generic handler for updating one document with a given id 
 * @param Model - the model to query on
 * @param filterCallback - a function that gets the request object and returns object with the id of the doc and the updated object
 * - response with the doc of the Model if successful, otherwise throws a 404 error 
 */
    exports.updateOne = (Model, filterCallback = () => null) =>(
        catchAsync(async (req, res, next)=>{
            const {id, update} = filterCallback(req) //{id: , update: }
            if (!id || !update){
                throw Error("You have to provide document id and updated object")
            }
            const doc = await Model.findByIdAndUpdate(id, update);

            if(!doc){
                return next(new AppError("Couldn't update the document"), 404)
            }
            res.status(200).json({status: "success", doc})
        }))



