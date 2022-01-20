const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());

app.use((req,res,next)=> {
    res.setHeader('Access-Control-Allow-Origin','*');
    res.setHeader('Access-Control-Allow-Headers','Origin, X-Requested-With,Content-Type,Accept');
    res.setHeader('Access-Control-Allow-Methods','GET,POST,PATCH,DELETE,OPTIONS');
    next();
});

app.use((req,res,next)=> {
    console.log('First Middleware');
    next();
});

app.post("/api/posts",(req,res,next) => {
    const post = req.body;
    console.log(post);
    res.status(201).json({
        message:'Post added successfully'
    });
});

app.get("/api/posts",(req,res,next)=> {
    const posts = [
        {id:'abc123',title:"First server-side post", content:"This is coming from server"},
        {id:'abc124',title:"First server-side post2", content:"This is coming from server2"}
    ] 
    res.status(200).json({
        message:'post successfully',
        posts:posts
    });
});

module.exports = app;