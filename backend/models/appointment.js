var mongoose=require('mongoose');
var appointmentSchema=mongoose.Schema({
    date:Date,
    person:String,
    timings:[{
        time:String,
        typeAppoint:String,
        price:Number,
        booked:Boolean
    }]

});
var appointment=mongoose.model('appointment',appointmentSchema);
module.exports=appointment;