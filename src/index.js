const express = require('express')
require('./db/mongoose')
const cors = require('cors')

const plantRouter = require('./routers/plant')

const app = express()
const port = process.env.PORT || 9000


app.use(cors())
app.use(express.json())
app.use(plantRouter)


app.listen(port, ()=>{
    console.log('server is up on port ' + port)
})