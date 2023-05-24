const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
let  port =  5000;
const DBuri = process.env.DBuri || 'mongodb://localhost:27017';
const cors = require('cors');
const jwt  = require('jsonwebtoken');
const regRoute = require('./src/userRouts/regRouts');
const userBooks = require('./src/userRouts/authRoute');
const fileUpload = require("express-fileupload");




mongoose.set('strictQuery', false);
mongoose.connect(DBuri,(error,db)=>{
    if(error){
        console.log(error);
    }
    else{
        console.log("Connected to DataBase")
    }
})


const app = express();
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(express.urlencoded({ extended: true }));
app.use((req, res, next) => {
    
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept"
      );
    
    next();
  });
app.use(fileUpload({ useTempFiles: true }));
app.use("/public", express.static("public"));
app.use('/login/user/*',async(req,res,next)=>{
    let token = req.headers.authorization;
    await jwt.verify(token,"BookApp",(error,decoded)=>{
        if(error){
            return res.status(402).json({
                massage:"token is not valid"
            })
        }
        req.user = decoded.data;
        
    })
    next();

})

app.use(regRoute);
app.use(userBooks)


app.use('*',(req,res)=>{
    return res.status(500).json({
        massage:"page not found"
    })
})
app.listen(port,(e)=>{
    if(e){
        console.log(e)
    }
    else{
        `Server is running on port ${port}`
    }
})