const Promo = require("../models/Promo");

exports.createPromo = async(req, res, next) => {
    try {
        
        const body = req.body;
        const promo = await Promo.create(body);
        return res.status(201).json({message:"Promo Created", promo})
    } catch (error) {
        next(error)
    }
}

exports.getPromo  = async (req, res, next) => {
    try {
        const promo = await Promo.findOne({code : req.params.code.toUpperCase(), active:true});
        if (!promo) return res.status(400).json({message:"Invalid promo"});
        if(promo.expiresAt && promo.expiresAt < new Date()) return res.status(400).json({message:"Promo expired"});
        if(promo.usageLimit && promo.usageLimit > 0 && promo.usedCount >= promo.usageLimit) return res.status(400).json({message:"'Promo usage limit reached"});
        return res.status(200).json({promo})
    } catch (error) {
        next(error)
    }
}

exports.listPromos = async (req, res, next) => {
    try {
        const promos = await Promo.find();
        return res.status(200).json({message: "Lists of promo", promos})
    } catch (error) {
        next(error)
    }
}

exports.updatePromo = async (req, res, next) => {
    try {
        console.log('body', req.body)
        const promo = await Promo.findByIdAndUpdate(req.params.id, req.body, {new:true});
        return res.status(200).json({message: "Promo", promo})
    } catch (error) {
        next(error)
    }
}

exports.deletePromo = async(req, res, next) => {
    try {
        await Promo.findByIdAndDelete(req.params.id)
        return res.status(200).json({message: "Promo deleted"})
    } catch (error) {
        next(error)
    }
}