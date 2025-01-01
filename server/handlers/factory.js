// mostly get all handlers
const AppError = require('../utils/AppError')


exports.getAll = (Model, modelName) =>(
    catchAsync(async (req, res, next)=>{
        const docs = await Model.find()
        if(!docs){
            return next(new AppError('לא נמצאו מסמכים מתאימים'), 404)
        }
        res.status(200).json({status: "success", docs})
    }))

