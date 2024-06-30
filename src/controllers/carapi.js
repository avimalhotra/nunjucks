const db=require("../dao");
const car=require("../models/cars");

exports.getApi=(req,res)=>{

    car.find({},{_id:0,__v:0}).then(data=>{
        res.status(200).json(data);
    }).catch(err=>{
        res.status(200).json(err);
    });
    
};