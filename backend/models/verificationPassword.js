var mongoose=require('mongoose');
var verifyPasswordSchema=mongoose.Schema({
    token: String,
    counter:Number,
    username: String,
    type:String

});
var verifyPassword=mongoose.model('verifyPassword',verifyPasswordSchema);
module.exports=verifyPassword;