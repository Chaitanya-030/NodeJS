const express = require('express');
require('./db/Config');
const cors = require('cors');
const User = require("./db/User");
const app = express();

app.use(express.json());
app.use(cors());

app.post("/register", async (request, response) => {
    let user = new User(request.body)
    let result = await user.save();
    result = result.toObject();
    delete result.password;
    response.send(result);
})

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

app.listen(5000);