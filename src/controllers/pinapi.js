const db=require("../dao");
const pin=require("../models/pin");

exports.getApi=(req,res)=>{

    pin.find({},{_id:0,__v:0}).then(data=>{
        res.status(200).json(data);
    }).catch(err=>{
        res.status(200).json(err);
    });
    
};