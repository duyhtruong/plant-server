/*
    API endpoints routes for
    communicating with User Database 
*/

const express = require('express')
const router = new express.Router()
const User = require('../models/user')
const auth = require('../middleware/auth')

//Register new User
router.post('/users', async(req, res) =>{
    const user = new User(req.body)
    try{
        await user.save()
        const token = await user.generateAuthToken()
        res.status(201).send({user:user, token:token})
    }catch(e){
        res.status(400).send(e)
    }
})

//Login user
router.post('/users/login', async(req,res)=>{
    try{
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        res.send({user:user, token:token})
    }catch(e){
        res.status(400).send({error: 'Invalid Credentials'})
    }
})

//Logout user
router.post('/users/logout', auth, async(req,res)=>{
    try{
        req.user.tokens = req.user.tokens.filter((token)=>{
            return token.token !== req.token
        })

        await req.user.save()
        res.send()
    }catch(e){
        res.status(500).send()
    }
})

//Logout on all devices
router.post('/users/logoutAll', auth, async(req,res)=>{
    try{
        req.user.tokens = []
        await req.user.save()
        res.send()
    }catch(e){
        res.status(500).send()
    }
})

//Edit user
router.patch('/users/me', auth, async(req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name','email']
    
    const isValidOperation = updates.every((update)=>{
        return allowedUpdates.includes(update)
    })

    if (!isValidOperation){
        return res.status(404).send({error: 'Invalid updates'})
    }

    try{
        updates.forEach((update)=>{
            req.user[update] = req.body[update]
        })
        await req.user.save()
        res.send(req.user)
    }catch (e) {
        res.status(400).send(e)
    }
})

//Delete user account
router.delete('/users/me', auth, async (req, res)=>{
    try{
        console.log(req.user)
        await req.user.remove()
        res.send(req.user)
    }catch(e){
        console.log(e)
        res.status(500).send()
    }
}) 


module.exports = router