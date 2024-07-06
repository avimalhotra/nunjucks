require("dotenv").config();
const express=require("express");
const app=express();
const port=process.env.PORT  || 3000;
const path=require("path");
const nunjucks=require("nunjucks");
const mongoose=require('./dao');
const [cars,pin,admin]=[require('./models/cars'),require('./models/pin'), require('./models/admin')];
const session=require('express-session');

app.set('trust proxy', 1); 

app.use(session({
    secret:"session",
    resave:false,
    saveUninitialized:true,
    cookie:{secure:false}
}));

const bodyParser=require('body-parser'); 
app.use(bodyParser.urlencoded({ extended: false })); 
app.use(bodyParser.json());


const carapi=require('./controllers/carapi');

app.use(express.static(path.resolve("src/public")));

nunjucks.configure(path.resolve(__dirname,'public/view'),{
    express:app,
    autoscape:true,
    noCache:false,
    watch:true
}); 


/* passport */
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function (user, done) {
    done(null, user);
  });
passport.deserializeUser(function (user, next) {
    next(null, user);
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

/* passport */
app.get("/login",(req,res)=>{ res.status(200).render("login.html",{title:"Login"}) });

function isAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      next();
    } else {
      res.status(403).render('login.html',{msg:"Forbidden",title:"Login Again"});
    }
}

app.get('/admin', isAuthenticated, (req, res) => { res.render('admin.html',{title:"admin"}) });

passport.use( new LocalStrategy({ usernameField: 'name', passwordField:'password' },(username, password, done) => {
    
    admin.find({ name: username }).then(( user, err) => { 

    user=user[0];

      if (err) { return done(err); }
      if (!user) { return done(null, null, { message: 'No user found!' }); }
      if (user.password !== password) {return done(null, null, { message: 'Username or password is incorrect!' }) }

      return done(null, user, null);

    });
  }
));


app.post("/login",(req,res)=>{
    
    passport.authenticate('local',  (err, user, info) =>{
        
        if (err) {
          res.render('login.html', { error: err });
        } 
        else if (!user) {
          res.render('login.html', { errorMessage: info.message });
        } 
        else {
          //setting users in session
          req.logIn(user, function (err) {
            if (err) {
              res.render('login.html', { error: err });
            } else {
              res.render('admin.html',{ name:user.name});
             }
          })
        }
      })(req, res);
});

app.get("/signout",(req,res)=>{ req.session.destroy(); res.status(200).render("login.html",{title:"Signout"}) });



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
