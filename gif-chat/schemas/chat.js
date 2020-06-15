var mongoose = require('mongoose');

var{Schema} = mongoose;
var {Types: { ObjectId}} =Schema;
var chatSchema = new Schema({
    room: {
        type: ObjectId,
        required: true,
        ref: 'Room',
    },
    user: {
        type: String,
        required: true,
    },
    chat: String,
    gif: String,
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Chat', chatSchema);