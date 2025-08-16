const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//create Schema
const ItemSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    date:{
        type: Date,
        default: Date.now
    }
});

ItemSchema.index({ name: 1 });
module.exports = Item = mongoose.model('Item', ItemSchema);