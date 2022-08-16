const mongoose = require('mongoose')
require('dotenv').config()
const mongoURI = process.env.mongoURI

const connectToMongo = ()=>{
    mongoose.connect(mongoURI,{ useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true }, ()=>{
        console.log('Connected to Mongo successfully!')
    })
    // .then((result) => {
    //     console.log(result);
    // }).catch((err) => {
    //     console.log(err);
    // });
}

module.exports = connectToMongo
