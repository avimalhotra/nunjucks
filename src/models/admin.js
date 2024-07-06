const mongoose=require('../dao');

const Schema=mongoose.Schema;

const Admin=new Schema({
    _id:mongoose.ObjectId,
    name: String,
    password: { type: String, required:true,  }
},{collection:"users"});

module.exports=mongoose.model("model3",Admin);