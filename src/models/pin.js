const mongoose=require('../dao');

const Schema=mongoose.Schema;

const Pin=new Schema({
    _id:mongoose.ObjectId,
    officeName: String,
    pincode:Number,
    taluk:String,
    districtName:String,
    stateName:String
},{collection:"pincode"});

module.exports=mongoose.model("model2",Pin);