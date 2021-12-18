import mongoose from 'mongoose';


const NotesSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,  
    },
    tag: {
        type: String,
    },
    timeStramp: {
        type: Date,
        default: Date.now
    },
});

module.exports = mongoose.model('notes', NotesSchema)