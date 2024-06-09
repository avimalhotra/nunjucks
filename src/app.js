require("dotenv").config();
const express=require("express");
const app=express();
const port=process.env.PORT ;
const path=require("path");
const nunjucks=require("nunjucks");

app.use(express.static(path.resolve("src/public")));

nunjucks.configure(path.resolve(__dirname,'public/view'),{
    express:app,
    autoscape:true,
    noCache:false,
    watch:true
}); 

app.get("/",(req,res)=>{
    res.status(200).render("index.html",{title:"homepage",data:["Jan","Feb","Mar","Apr"],car:{name:"swift",power:82,torque:112}});
});
app.get("/about",(req,res)=>{
    res.status(200).render("about.html",{title:"About Us", author:{name:"Avinash",exp:12}});
});
app.get("/blog",(req,res)=>{
    res.status(200).render("blog.html",{title:"Our Blogs"});
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
