var mongoose=require('mongoose');
var memberSchema=mongoose.Schema({
    username:String,
    password:String,
    email:String,
    listOfAppointments:[{
        date:Date,
        timings:[String]
    }]

});
var member=mongoose.model('member',memberSchema);
module.exports=member;