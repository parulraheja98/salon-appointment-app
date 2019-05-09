const assert = require('assert');
const Payment = require('../models/payment.js');
const mongoose = require('mongoose');
const app = 'http://localhost:3017';
var chai = require('chai')
    , chaiHttp = require('chai-http');
mongoose.connect('mongodb://praheja:boldtest12345@ds163764.mlab.com:63764/shoppingcart');

describe('Payment Details' , function() {
    it('Payment Details' , function(done)  {
        chai.request(app)
        .get('/transactioninfo')
        .end((err,data) => {
            assert(data.body.items.length > 0);
            done();

        })

        })

    })

describe('Payment Details by household' , function() {
    it('Payment Details' , function(done)  {
        chai.request(app)
        .get('/transactioninfo')
        .end((err,data) => {
            assert(data.body.items.length > 0);
            done();

        })

        })

    })