const mongoose = require('mongoose')

const plantSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    sun:{
        type:String,
        required: true
    },
    water:{
        type: String,
        required: true
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    } 
},{
    timestamps: true
})

const Plants = mongoose.model('Plants', plantSchema)

module.exports = Plants