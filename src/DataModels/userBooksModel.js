const mongoose = require('mongoose');
const schema  = mongoose.Schema;
const objId = schema.Types.ObjectId;

const bookSchema = new schema({
    user:{type:objId,ref:'BookUser'},
    title:{type:String,require:true},
    ISBN : {type:String, require:true},
    author:{type:String, require:true},
    description:{type:String, require:true},
    date:{type:Date, require:true},
    publisherOfBook:{type:String, require:true},
    bookImg:{type:String},
    genres:{type:String}
});

const BooksModel = mongoose.model('UserBooks',bookSchema);
module.exports = BooksModel;