const express = require('express');
let userData = require('../DataModels/userDataModel');
let BooksData = require('../DataModels/userBooksModel');
const cloudinary = require("cloudinary").v2;


// config cloudinary
cloudinary.config({ 
  cloud_name: 'dg3xsxi5b', 
  api_key: '445377114519322', 
  api_secret: '03fLoQEtEVTpZHjHfjwYJuj-rZg' 
});

let userRoute = express();
userRoute.post('/login/user/postBooks',async(req,res)=>{
    try {
        console.log(req.body)
        const file = req.files.bookImg.tempFilePath;
        console.log(file)
        let bookDetails = {
            user:req.user,
            date:new Date().toLocaleString(),
            ...req.body
        };
        await cloudinary.uploader.upload(file, async (err, result) => {
            console.log(result.secure_url);
            bookDetails.bookImg = result.secure_url
        });
        // console.log(bookDetails)
        let db = await BooksData.create(bookDetails);
        
        return res.status(200).json({
            massage:"Given books are stored in Database."
        })
        
    } catch (error) {
        return res.status(400).json({
            massage:"Bookes are not posted on database"
        })
        
    }
});
userRoute.get('/login/user/getBooks',async(req,res)=>{
    try {
        let userId = req.user;
        let books = await userData.find({_id:userId}).populate('Books');
        
        return res.status(200).json({
            massage:"books are...",
            books:books[0].Books
        })
        
    } catch (error) {
        return res.status(400).json({
            massage:"Sorry unable to get books."
        })
        
    }
});
userRoute.put('/login/user/putBooks',async(req,res)=>{
    try {
        
        let id = req.body._id;
        console.log(req.files !== null)
        if(req.files !== null){
            let upImg = req.files.bookImg.tempFilePath;
            let exImg = await BooksData.find({_id:id});
            exImg = exImg[0].bookImg.split("/");
            
            // deleting img from cloudinary

            await cloudinary.uploader.destroy(exImg[exImg.length-1].split(".")[0], (err,result)=> { console.log(result) });

            // creating new img in cloudinary.

            await cloudinary.uploader.upload(upImg, async (err, result) => {
                
                req.body.bookImg = result.secure_url
            });
        }
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
        let id = req.headers.id;
        let exImg = await BooksData.find({_id:id});
            exImg = exImg[0].bookImg.split("/");
            
            // deleting img from cloudinary

         await cloudinary.uploader.destroy(exImg[exImg.length-1].split(".")[0], (err,result)=> { console.log(result) });
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