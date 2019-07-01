const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Plants = require('./plant')

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,  
    },
    password:{
        type:String,
        required:true,

    },
    email:{
        type: String,
        required:true,
        unique:true,
        trim:true,
        lowercase:true
    },
    tokens:[{
        token:{
            type: String,
            required: true
        }
    }]
})



//Methods

//Generate JWT user authentication token when logging in and creating User
userSchema.methods.generateAuthToken = async function() {
    const user = this
    const token = jwt.sign({_id: user._id.toString()}, process.env.JWT_SECRET)

    user.tokens = user.tokens.concat({token:token})
    await user.save()
    return token
}

//Check login credentials with database
userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({email:email})

    if(!user){
        throw new Error('unable to login')
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if(!isMatch){
        throw new Error('unable to login')
    }
    return user
    }



//Hash plain-text password before saving to database using pre method
userSchema.pre('save',async function(next){
    const user = this
    if(user.isModified('password')){
        user.password = await bcrypt.hash(user.password,8)
    }
    next()
})


//Link User model with Plant model
userSchema.virtual('plants',{
    ref: 'Plants',
    localField: '_id',
    foreignField: 'owner'
})


//Delete plants linked to User when User is removed
userSchema.pre('remove', async function(next){
    const user = this
    await Plants.deleteMany({owner: user._id})
    next()
})


const User = mongoose.model('User', userSchema)

module.exports = User

