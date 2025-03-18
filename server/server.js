const mongoose = require('mongoose')
const dotenv = require('dotenv')
const app = require('./app')

dotenv.config({ path: './config.env' });

//mongodb connection
mongoose.connect(process.env.DB).then(con => console.log("connected to db")).catch(err=> console.log(err))




app.listen(8000, ()=>{console.log(`listening on port 8000`)})