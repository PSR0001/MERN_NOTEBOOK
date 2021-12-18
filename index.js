const express = require('express')
const connectToMongo = require('./Database/db')
require('dotenv').config()

const app = express()
const PORT = process.env.PORT
connectToMongo() 
// for using json 
app.use(express.json())
// Available Routes
app.use('/api/auth',require('./routes/auth'))
app.use('/api/notes',require('./routes/notes'))



app.listen(PORT, ()=>{console.log(`Server is running at port ${PORT}`)})
