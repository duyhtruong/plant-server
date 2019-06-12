const express = require('express')
const Plants = require('../models/plant')
const router = new express.Router

router.get('/', (req,res)=>{
    res.send('hello')
})

router.post('/plant', async (req,res)=>{
    const plant = new Plants(req.body)

    try{
        await plant.save()
        res.status(201).send(plant)
    }catch(e){
        res.status(400).send(e)
    }

})



router.get('/plant', async (req,res)=>{
    try{
        const plant = await Plants.find()
        res.send(plant)
    }catch(e){
        res.status(400).send()
    }
})









router.delete('/plant/:id', async (req,res)=>{
    
    
    try{
        const plant = await Plants.findOneAndDelete({_id: req.params.id})
        if(!plant){
            return res.status(404).send()
        }
        res.send(plant)
    }catch(e){
        res.status(500).send()
    }
})


module.exports = router