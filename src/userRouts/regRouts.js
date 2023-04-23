const express = require('express');
let userData = require('../DataModels/userDataModel');
let BooksData = require('../DataModels/userBooksModel');
const jwt = require('jsonwebtoken');

let regRoutes = express();

regRoutes.post('/register/user',async(req,res)=>{
    try {
        
        let {email,password} = req.body;
        console.log(password.length <! 6 )
        if(email.length === 0 || password.length < 6 || password.length > 16){
            return res.status(204).json({
                massage:'Password length between 6 to 16 and email also should be valid.'
            })
        }
        let user = await userData.create({
            userName:email,
            password:password
        });
        return res.status(200).json({
            massage: 'User Successfully register'
        })

        
    } catch (e) {
        res.status(401).json({
            massage:e.massage,
            msg:"user is not register"
            
        })
        
    }
});

regRoutes.post('/login/user',async(req,res)=>{
    try {
        
        let {email,password} = req.body;
        if(email.length === 0 || password.length < 6 || password.length > 16){
            return res.status(204).json({
                massage:'Password length between 6 to 16 and email also should be valid.'
            })
        }
        
        let user = await userData.find({userName:email});

        console.log(user)
        if(!user){
            return res.status(300).json({
                massage:"Sorry! You are not register on our database."
            })
        }
        if(user[0].password !== password){
            return res.status(301).json({
                massage:"wrong Password"
            })
        }
        let token = await jwt.sign({
            exp:Math.floor(Date.now()/ 1000)+(60 * 60),
            data:user[0]._id
        },"BookApp");
        console.log(token)
        return res.status(200).json({
            massage: 'User Successfully Login',
            token
        })

        
    } catch (e) {
       return res.status(401).json({

            massage:e.massage
        })
        
    }
})

module.exports = regRoutes;