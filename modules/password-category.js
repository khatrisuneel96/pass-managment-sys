const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');
// mongoose.connect('mongodb://localhost:27017/pms', {useNewUrlParser: true, useCreateIndex: true});
mongoose.connect('mongodb+srv://pmsdb:pms123@cluster0-oixlo.mongodb.net/pms?retryWrites=true&w=majority', {useNewUrlParser: true, useCreateIndex: true});
var conn = mongoose.Collection;
const passCatSchema = new mongoose.Schema({
    password_category: {type: String,
        required: true,
        index: {
            unique: true,
        }},
    
    date: {
        type: Date,
        default: Date.now }
});

passCatSchema.plugin(mongoosePaginate);
var passCatModel = mongoose.model('Password_Categories', passCatSchema);
module.exports = passCatModel;