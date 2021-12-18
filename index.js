const express = require('express')
const connectToMongo = require('./Database/db')

const app = express()
const PORT = 5000
connectToMongo() 

app.get('/',(req,res)=>{
   res.send('Hello World!')
})

app.listen(PORT, ()=>{console.log(`Server is running at port &{PORT}`)})
