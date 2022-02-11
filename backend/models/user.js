const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = mongoose.Schema({
    email: {type:String, required: true, unique: true}, //unique does not act as a validator to throw error if email not unique, it was instead for moongoose optimizaion for performance
    password: {type:String, require:true},
});

userSchema.plugin(uniqueValidator); //plugin act as an extra Hook for the model before saving into the database

module.exports = mongoose.model('User',userSchema);