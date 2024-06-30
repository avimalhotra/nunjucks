const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/node').then(() => console.log('Connected to database!'));

const db=mongoose.connection;

const Schema=mongoose.Schema;

const Car=new Schema({
    _id:mongoose.ObjectId,
    name:{ type:String, required:true, unique: true, dropDups:true},
    type:{ type:String, required:true,},
    price:{ type:Number, required:true}, 
    },{collection:"suzuki",versionKey:false});

const car=mongoose.model("car",Car);

//const insertCar=new car({_id:new mongoose.Types.ObjectId(),name:'alto',type:'hatchback',price:400000});
const insertCar=new car({_id:new mongoose.Types.ObjectId(),name:'fronx',type:'hatchback',price:900000});


db.on('error', function(err){ throw err }); 

db.once("open",function(){
    insertCar.save().then(i=>console.log("done")).catch(e=>console.warn(e));


    //car.find({type:"hatchback"}).then(i=>console.log(i)).catch(e=>console.warn(e));
    //car.find({type:"hatchback"}).limit(2).then(i=>console.log(i))
    //car.find({}).sort({name:1}).then(i=>console.log(i))
    //car.find({}).sort({name:1}).limit(3).then(i=>console.log(i));
    //car.find({}).sort({name:1}).limit(3).skip(3).then(i=>console.log(i));
    //car.find({}).sort({name:1}).limit(3).skip(6).then(i=>console.log(i));

    console.log("Mongoose connected");
});