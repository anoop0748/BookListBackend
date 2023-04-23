const mongoose = require('mongoose');


const userSchema = new mongoose.Schema({
    userName:{type:String,require:true},
    password:{type:String,require:true}
})

userSchema.set('toObject',{virtuals:true});
userSchema.set('toJson',{virtuals:true});
userSchema.virtual(
    "Books",{
        "ref" : "UserBooks",
        localField:"_id",
        foreignField:"user"
    }
);

const userDataModel = mongoose.model("BookUser",userSchema);

module.exports = userDataModel;
