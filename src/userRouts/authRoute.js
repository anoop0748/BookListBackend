const express = require('express');
let userData = require('../DataModels/userDataModel');
let BooksData = require('../DataModels/userBooksModel');


let userRoute = express();
userRoute.post('/login/user/postBooks',async(req,res)=>{
    try {
        let bookDetails = {
            user:req.user,
            date:Date.now(),
            ...req.body
        };
        console.log(bookDetails,"sdfkjh",req.body)
        let db = await BooksData.create(bookDetails);
        return res.status(200).json({
            massage:"Given books are stored in Database."
        })
        
    } catch (error) {
        res.status(400).json({
            massage:"Bookes are not posted on database"
        })
        
    }
});
userRoute.get('/login/user/getBooks',async(req,res)=>{
    try {
        let userId = req.user;
        let books = await userData.find({_id:userId}).populate('Books');
        console.log(books[0].Books)
        return res.status(200).json({
            massage:"books are...",
            books:books[0].Books
        })
        
    } catch (error) {
        res.status(400).json({
            massage:"Sorry unable to get books."
        })
        
    }
});
userRoute.put('/login/user/putBooks',async(req,res)=>{
    try {
        let id = req.body.id;
        let upDb = await BooksData.updateOne({_id:id},req.body);
        return res.status(200).json({
            massage:'successfully updated your data'
        }) 
        
    } catch (error) {
        return res.status(400).json({
            massage:"unable to update your books",
            error:error.massage
        })
        
    }
});
userRoute.delete('/login/user/deleteBooks',async(req,res)=>{
    try {
        let id = req.body.id;
        
        let upDb = await BooksData.deleteOne({_id:id});
        return res.status(200).json({
            massage:'successfully deleted your data'
        }) 
        
    } catch (error) {
        return res.status(400).json({
            massage:"unable to update your books",
            error:error.massage
        })
        
    }
})

module.exports = userRoute;