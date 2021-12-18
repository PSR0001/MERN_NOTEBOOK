const mongoose =require( 'mongoose');
const { Schema } = mongoose;

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