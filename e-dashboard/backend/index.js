// app.post is used if we want to save or send the data in/to the database
// app.get is ised if we want some data from the database

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

//backend for product listing
app.get('/products', async (request, response) => {
    let products = await Product.find();
    if(products.length > 0) {
        response.send(products);
    }
    else{
        response.send({result: 'No Products Found'});
    }
})

//delete product from database
app.delete('/product/:id', async (request, response) => {
    const result = await Product.deleteOne({_id: request.params.id});
    response.send(result);
})

// to get the single product to fill information in update form
app.get('/product/:id', async (request, response) => {
    let result = await Product.findOne({_id: request.params.id});
    if(result) {
        response.send(result);
    }
    else {
        response.send({result: 'No Record Found'});
    }
})

// to update the product with given information
app.put('/product/:id', async (request, response) => {
    let result = await Product.updateOne(
        {_id: request.params.id}, 
        {
            $set: request.body
        }
    );
    response.send(result);
})

// to search the product by name, category, ....
app.get('/search/:key', async (request, response) => {
    let result = await Product.find({
        "$or" : [
            {name : {$regex: request.params.key}},
            {company : {$regex: request.params.key}},
            {category : {$regex: request.params.key}}
        ]
    });
    response.send(result)
})



app.listen(5000);