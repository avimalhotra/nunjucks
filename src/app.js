require("dotenv").config();
const express=require("express");
const app=express();
const port=process.env.PORT  || 3000;
const path=require("path");
const nunjucks=require("nunjucks");
const mongoose=require('./dao');
const [cars,pin]=[require('./models/cars'),require('./models/pin')];

const carapi=require('./controllers/carapi');

app.use(express.static(path.resolve("src/public")));

nunjucks.configure(path.resolve(__dirname,'public/view'),{
    express:app,
    autoscape:true,
    noCache:false,
    watch:true
}); 


app.get("/",(req,res)=>{
    cars.find({},{_id:0,__v:0}).then(data=>{
        res.status(200).render("index.html",{title:"homepage", data: data });
    })
});

app.get("/search",(req,res)=>{
    const q=req.query.car;          // string
    const name=new RegExp(q,'i');

    cars.find({name: name },{_id:0,__v:0}).then(data=>{
        
        if( data.length==0){ 
            res.status(200).render('search.html',{ title:"Search results", error:"No car found"});
        }
        else{
            res.status(200).render('search.html',{ title:"Search results", data: data});
        }

    });

   
})



app.get("/api",carapi.getApi);

app.get("/pincode/:id",(req,res)=>{
    pin.find({pincode:req.params.id},{_id:0,__v:0}).then(data=>{
        if(data.length==0){ res.status(200).send([{"error":"No pincode found"}]); }
        else{ res.status(200).send(data);}
    }).catch(err=>{
        res.status(200).send(err);
    });
});

app.get("/about",(req,res)=>{
    res.status(200).render("about.html",{title:"About Us", author:{name:"Avinash",exp:12}});
});
app.get("/blog",(req,res)=>{
    res.status(200).render("blog.html",{title:"Our Blogs"});
});
app.get("/blog/:id",(req,res)=>{
    res.status(200).render("blog.html",{title:`${req.params.id}`});
});
app.get("/contact",(req,res)=>{
    res.status(200).render("about.html",{title:"Contact US"});
});

app.get("/**",(req,res)=>{
    res.status(200).render("error.html",{title:"404", message:"Page Not Found"});
});


app.listen(process.env.PORT,()=>{
    console.log(`server running at http://127.0.0.1:${port}`);
})
