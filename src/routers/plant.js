const express = require('express')
const Plants = require('../models/plant')
const router = new express.Router
const auth = require('../middleware/auth')


router.get('/', (req,res)=>{
    res.send('hello')
})

router.post('/plant',auth,  async (req,res)=>{
    const plant = new Plants({
        ...req.body,
        owner: req.user._id
    })

    try{
        await plant.save()
        res.status(201).send(plant)
    }catch(e){
        res.status(400).send({'error':e, 'test': 'hello'})
    }

})

router.get('/plant',auth, async (req,res)=>{
    try{
        const plant = await Plants.find({owner: req.user._id})
        res.send(plant)
    }catch(e){
        res.status(400).send()
    }
})

router.get('/plant/:id',auth, async (req,res)=>{
    const _id = req.params.id
    
    try{
        //const plant = await Plants.findOne({_id: req.params.id})
        const plant = await Plants.findOne({_id: _id, owner: req.user._id})

        if(!plant){
            res.status(404).send()
        }
        res.status(201).send(plant)
    }catch(e){
        res.status(500).send()
    }
})

router.delete('/plant/:id',auth, async (req,res)=>{    
    try{
        const plant = await Plants.findOneAndDelete({_id: req.params.id, owner: req.user._id})
        if(!plant){
            return res.status(404).send()
        }

        res.send(plant)
    }catch(e){
    
        res.status(500).send()
    }
})

router.patch('/plant/:id',auth, async(req,res)=>{
  
    const updateArray = Object.keys(req.body)
    const updateTerms = ['name', 'water','sun','lastwater']
    const validateTerm = updateArray.every((updateTerm)=>{
        return updateTerms.includes(updateTerm)
    })

    if(!validateTerm){
        res.status(404).send({error: 'invalid update'})
    }
    
    try{
        const plant = await Plants.findOne({_id: req.params.id, owner: req.user._id})

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