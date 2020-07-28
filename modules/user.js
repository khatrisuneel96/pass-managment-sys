const mongoose = require('mongoose');
// mongoose.connect('mongodb://localhost:27017/pms', {useNewUrlParser: true, useCreateIndex: true});
mongoose.connect('mongodb+srv://pmsdb:pms123@cluster0-oixlo.mongodb.net/pms?retryWrites=true&w=majority', {useNewUrlParser: true, useCreateIndex: true});
var conn = mongoose.Collection;
const userSchema = new mongoose.Schema({
    username: {type: String,
        required: true,
        index: {
            unique: true,
        }},

    email: {type: String,
        required: true,
        index: {
            unique: true,
        }},
    
    password: {type: String,
        required: true,
        index: {
            unique: true,
        }},
    
    date: {
        type: Date,
        default: Date.now }
});

var userModel = mongoose.model('Users', userSchema);
module.exports = userModel;