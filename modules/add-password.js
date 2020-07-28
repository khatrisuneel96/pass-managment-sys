const mongoose = require('mongoose');
// mongoose.connect('mongodb://localhost:27017/pms', {useNewUrlParser: true, useCreateIndex: true});
mongoose.connect('mongodb+srv://pmsdb:pms123@cluster0-oixlo.mongodb.net/pms?retryWrites=true&w=majority', {useNewUrlParser: true, useCreateIndex: true});
var conn = mongoose.Collection;
const passwordSchema = new mongoose.Schema({
    password_category: {type: String,
        required: true,
       },
    project_name: {type: String,
        required: true,
        },
    password_details: {type: String,
        required: true,
        },
    
    date: {
        type: Date,
        default: Date.now }
});

var passwordModel = mongoose.model('Password_Details', passwordSchema);
module.exports = passwordModel;