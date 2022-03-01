const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const healthRoutes = require("./routes/health");
const postsRoutes = require("./routes/posts");
const userRoutes = require("./routes/user"); //referring to user.js file
const environment = process.env.NODE_ENV || 'development';
console.log(`Current Environment : ${environment}`);
const app = express();

const options = {
    reconnectTries: Number.MAX_VALUE, // Never stop trying to reconnect
    reconnectInterval: 500, // Reconnect every 500ms
}

mongoose.connect(`mongodb+srv://victor:${process.env.MONGO_ATLAS_PW}@cluster0.exzto.mongodb.net/node-angular?retryWrites=true&w=majority`).then(
    ()=>{
        console.log('Connected to database!');
    }).catch(
        (x)=> {
            console.log('Connection failed! : '+ x);
        }
    );

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
//app.use(express.static(path.join("images"))); //So client is able to access all the files inside /images by "http://localhost:3000/png1.png"
if (environment === 'development') {
//For Development use this :
app.use("/images",express.static(path.join("backend/images"))); //by setting the 'root' paramerter "/images", URL has to be like "http://localhost:3000/images/png1.png"
}else {
//For Production use this  :
app.use("/images",express.static("images")); //by setting the 'root' paramerter "/images", URL has to be like "http://localhost:3000/images/png1.png"
//Some info from documentation : However, the path that you provide to the express.static function is relative to the directory from where you launch your node process.
}

app.use((req,res,next)=> {
    res.setHeader('Access-Control-Allow-Origin','*');
    res.setHeader('Access-Control-Allow-Headers','Origin, X-Requested-With,Content-Type,Accept,Authorization');
    res.setHeader('Access-Control-Allow-Methods','GET,POST,PATCH,PUT,DELETE,OPTIONS');
    next();
});

app.use((req,res,next)=> {
    console.log('First Middleware');
    next();
});

app.use("/health",healthRoutes);
app.use("/api/posts",postsRoutes);
app.use("/api/user",userRoutes); // eg: http://localhost:3000/api/user

module.exports = app;