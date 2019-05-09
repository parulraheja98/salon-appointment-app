var mongoose=require('mongoose');
var verificationSchema=mongoose.Schema({
    token: String,
    name: String,
    type:String

});
var verification=mongoose.model('verification',verificationSchema);
module.exports=verification;