//all the modules that i need for this

const express = require('express'); //used for server making
const ejs = require('ejs');//used to apply javascript into html code
const findOrCreate = require('mongoose-findorcreate');
const bcrypt = require("bcrypt");
const saltRounds = 10;
// const lodash = require('lodash');//used for text variations
const mongoose = require('mongoose');//Database manager
const bodyParser = require('body-parser');//used to recives data from forms

//connecting the mongoose local data base with the story
//mongoose.connect("mongodb+srv://admin-sachin:Sachin@123@cluster0-pf7ee.mongodb.net/hospitalDB", {useNewUrlParser: true});
mongoose.connect("mongodb://localhost:27017/hospitalDB2", {
  useNewUrlParser: true
});

var name;

var loginToken=false;
//schema decides all the data in the data base
const paitentSchema={
  paitentID:Number,
  name:String,
  age:Number,
  height:Number,
  weight:Number,
  diesease:String,
  review:String,
  bloodPressureCount:[Number],
  heartRateCount:[Number]
};

//for logins of admin
const adminSchema = new mongoose.Schema({
  email:String,
  password:String
});

//for logins of Doctors
const doctorsSchema = new mongoose.Schema({
  email:String,
  password:String
});

//for logins of staff
const staffSchema = new mongoose.Schema({
  email:String,
  password:String
});

//making models for all the schemas
const Paitent=mongoose.model("Paitents",paitentSchema);

const Admin=mongoose.model("Admins",adminSchema);

const Doctor = new mongoose.model("Doctors",doctorsSchema);

//creating an app for all express function
const app = express();

//using ejs as the view engine
app.set('view engine','ejs');

//allowing body parser to use urlencoded
app.use(bodyParser.urlencoded({enxtended:true}));
app.use(express.static("public"));

//http requests

//home get
app.get("/",(req,res)=>{
  res.redirect("/register");
})
app.get("/register",(req,res)=>{
  loginToken=false;
  res.render("register");
})

app.get("/login", function(req, res){
  loginToken=false;
  res.render("login");
});

app.post("/register",(req,res)=>{
  console.log(req.body.email);
  console.log(req.body.password);
  bcrypt.hash(req.body.password,saltRounds,(err,hash)=>{
    const newAdmin = new Admin({
      email: req.body.email,
      password:hash
    });
    newAdmin.save(err=>{
      if(err){
        console.log(err);
      } else {
        loginToken=true;
        name=req.body.email;
        res.redirect("/homePageAdmin");
      }
    })
  });
});

app.post("/login",(req,res)=>{
  loginToken=false;
  const email=req.body.email;
  const password=req.body.password;

  Admin.findOne({email:email},(err,foundUser)=>{
    if(err){
      console.log(err);
    } else {
      if(foundUser){
        bcrypt.compare(password, foundUser.password,(err,result)=>{
          if(result == true){
            loginToken=true;
            name=email;
            res.redirect("/homePageAdmin");
          }
        });
      }
    }
  });
});

app.get("/homePageAdmin",(req,res)=>{
  if(loginToken==true){
    res.render("homePageAdmin",{name:name});
  }
  else{
    res.redirect("/login");
  }
})

app.listen(3000,()=>{console.log("server started at port 300");});
