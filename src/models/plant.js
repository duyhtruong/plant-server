const mongoose = require('mongoose')

const plantSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    water:{
        type: String,
        required: true
    }
}, {
    timestamps: true
})

const Plants = mongoose.model('Plants', plantSchema)

module.exports = Plants