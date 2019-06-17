const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

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


//generate jwt user authentication token
userSchema.methods.generateAuthToken = async function() {
    const user = this
    const token = jwt.sign({_id: user._id.toString()}, 'secretplaceholder')

    user.tokens = user.tokens.concat({token:token})
    await user.save()
    return token
}


//check log in credentials with database
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

//hash plain text password before saving using pre
userSchema.pre('save',async function(next){
    const user = this
    if(user.isModified('password')){
        user.password = await bcrypt.hash(user.password,8)
    }
    next()
})

const User = mongoose.model('User', userSchema)

module.exports = User

