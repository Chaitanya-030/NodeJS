const express = require('express'); // import express
const app = express();

require('./db/Config'); // import config file which connects the database

const cors = require('cors'); // for specific error

// import our collections
const User = require("./db/User");
const Product = require("./db/Product");


app.use(express.json());
app.use(cors());

// backend for register
app.post("/register", async (request, response) => {
    let user = new User(request.body)
    let result = await user.save();
    result = result.toObject();
    delete result.password;
    response.send(result);
})

// backend for login
app.post('/login', async (request, response) => {
    if(request.body.password && request.body.email) {
        let user = await User.findOne(request.body).select("-password");
        if(user) {
            response.send(user)
        }
        else {
            response.send({result: 'User Not Found'})
        }
    }
    else{
        response.send({result: 'User Not Found'})
    }   
})

// backend for add product
app.post('/addproduct', async (request, response) => {
    let product = new Product(request.body);
    let result = await product.save();
    response.send(result);
})


app.listen(5000);