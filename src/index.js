const express = require('express')
require('./db/mongoose')
const cors = require('cors')

const plantRouter = require('./routers/plant')
const userRouter = require('./routers/user')

const app = express()
const port = process.env.PORT


//Express Middleware
app.use(cors())
app.use(express.json())
app.use(plantRouter)
app.use(userRouter)


app.listen(port, ()=>{
    console.log('server is up on port ' + port)
})