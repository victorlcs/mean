const express = require('express');

const app = express();

app.use((req,res,next)=> {
    console.log('First Middleware');
    next();
});

app.use("/api/posts",(req,res,next)=> {
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