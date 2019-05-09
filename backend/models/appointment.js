var mongoose=require('mongoose');
var appointmentSchema=mongoose.Schema({
    date:Date,
    person:String,
    timings:[{
        time:String,
        booked:Boolean
    }]

});
var appointment=mongoose.model('appointment',appointmentSchema);
module.exports=appointment;