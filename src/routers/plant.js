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

router.get('/plant/:id', async (req,res)=>{
    try{
        const plant = await Plants.findOne({_id: req.params.id})
        if(!plant){
            res.status(404).send()
        }
        res.status(201).send(plant)
    }catch(e){
        res.status(500).send()
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

router.patch('/plant/:id', async(req,res)=>{
  
    const updateArray = Object.keys(req.body)
    const updateTerms = ['name', 'water']
    const validateTerm = updateArray.every((updateTerm)=>{
        return updateTerms.includes(updateTerm)
    })

    if(!validateTerm){
        res.status(404).send({error: 'invalid update'})
    }
    
    try{
        const plant = await Plants.findOne({_id: req.params.id})

        if(!plant){
            res.status(404).send()
        }
        updateArray.forEach((update)=>{
            plant[update] = req.body[update]
        })

        await plant.save()
        res.send(plant)
    }catch(e){
        res.status(500).send()
        console.log(e)
    }
})

module.exports = router