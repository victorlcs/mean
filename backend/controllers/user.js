const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

exports.createUser = (req,res,next)=> {
    bcrypt.hash(req.body.password,10).then(hash => {
        const user = new User({
            email:req.body.email,
            password:hash
        }); //creating a MongoDB User model before sending it to MongoDB

        user.save() //To finally save into MongoDB 
        .then(result => {
            res.status(201).json({
                message:"User created.",
                result: result
            });
        })
        .catch(err => {
            res.status(500).json({
                    message: "Invalid authentication credentials!"
            });
        });
    })
};

exports.userLogin = (req,res,next) => {
    let fetchedUser;
    User.findOne({email: req.body.email})
    .then(user =>{
        if(!user){
            // return res.status(401).json({
            //     message:"Auth Failed"
            // })
            throw new Error('Auth failed');
        }
        fetchedUser = user;
        return bcrypt.compare(req.body.password,user.password);
    }
    )
    .then(result => {
        if(!result){
            return res.status(401).json({
                message:"Auth Failed"
            });
        }
        const token = jwt.sign({email: fetchedUser.email, userId: fetchedUser._id},process.env.JWT_KEY,
        {expiresIn: '1h'});
        res.status(200).json({
            token: token,
            expiresIn: 3600,
            userId: fetchedUser._id
        })
    })
    .catch(err => {
        return res.status(401).json({
            message: "Invalid authentication credentials!"
        })
    })
};