/* 
    Authenticate user and routes using JSON Web Tokens.
    Checks decoded user token with jwt verify.
    Find and return user instance with id and token 
*/

const jwt = require('jsonwebtoken')
const User = require('../models/user')

const auth = async (req,res,next) =>{
    try{
        const token = req.header('Authorization').replace('Bearer ', '')
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const user = await User.findOne({ _id: decoded._id, 'tokens.token': token})

        if(!user){
            throw new Error()
        }
        
        req.token = token
        req.user = user
        next()

    }catch(e){
        res.status(401).send({error: 'please authenticate'})
    }
}

module.exports = auth