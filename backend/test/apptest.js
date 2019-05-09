const assert = require('assert');
const Payment = require('../models/payment.js');
const mongoose = require('mongoose');
const app = 'http://localhost:3017';
var chai = require('chai')
    , chaiHttp = require('chai-http');
mongoose.connect('mongodb://praheja:boldtest12345@ds163764.mlab.com:63764/shoppingcart');


describe('Creating Payment Tests' , function() {
    it('creates payment' , function(done)  {
        
        const payment = new Payment({
            paymentId:'kff',
            paymentType:'testing',
            amountDue:100,
            paymentDate:Date.now(),
            lender:'testing',
            household:'checking'
        })

        payment.save()
        .then(function() {
            console.log('testing here ');
            assert(!payment.isNew);
            done();
        })
        })
})


describe('Reading Payment details' , function() {
    it('reading payments' , function(done) {
        Payment.findOne({paymentId:'kff'})
        .then((payment) => {
            assert(payment.lender == 'testing');
            done();
        })
    })

})

describe('Fetch Products ' , function() {

    it('fetch products' , function(done) {
        chai.use(chaiHttp).request(app)
        .get('/transactioninfo')
        .end(function(err,data) {
            console.log(data.body.items);
            assert(data.body.items.length != 0)
            done();

        })



    })
})