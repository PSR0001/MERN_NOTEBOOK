const express = require('express')
const FetchUser = require('../middlewares/FetchUser')
const router = express.Router()
const Notes = require('../models/Notes')
const { body, validationResult } = require('express-validator');

// Route 1 : creating a endpoint for fetching notes :GET method  login Required
router.get('/fetchallnotes', FetchUser, async (req, res) => {
    try {
        const notes = await Notes.find({ user: req.user.id })
        res.json(notes)
    }
    catch (error) {
        console.log(error)
        res.status(500).send('Internal Server Error!')
    }
})

//Route 2 :  ADD a new note using : POST /auth/addnotes login required
router.post('/addnotes', FetchUser, [
    body('title', 'Your title Atleast minimun 3 in Character').isLength({ min: 3 }),
    body('description', 'Your description Atleast minimun 5 in Character').isLength({ min: 5 }),

], async (req, res) => {

    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        let { title, description, tag } = req.body
        const note = new Notes({
            title, description, tag, user: req.user.id
        })

        const saveNote = await note.save()
        res.json(saveNote)
    }
    catch (error) {
        console.log(error)
        res.status(500).send('Internal Server Error!')
    }
})

// Route 3 : updatine the existing note ./routes/notes/updatenotes PUT login required
router.put('/updatenotes/:id', FetchUser, async (req, res) => {
    const { title, description, tag } = req.body;
    try {
        // creating a newNote obj
        const newNote = {};
        if (title) { newNote.title = title }
        if (title) { newNote.description = description }
        if (title) { newNote.tag = tag }

        // find the User
        let note = await Notes.findById(req.params.id)
        if (!note) { return res.status(404).send("Note Fund") }

        if (note.user.toString() !== req.user.id) { return res.status(401).send('Not Allow') }
        note = await Notes.findByIdAndUpdate(req.params.id, { $set: newNote }, { new: true })
        res.json({ note })
    }
    catch (error) {
        console.log(error)
        res.status(500).send('Internal Server Error!')
    }
})
// Route 4 : deleting the existing note ./routes/notes/updatenotes DELETE login required
router.delete('/deletenote/:id', FetchUser, async (req, res) => {
    try {
        // find the User
        let note = await Notes.findById(req.params.id)
        if (!note) { return res.status(404).send("Note Fund") }

        if (note.user.toString() !== req.user.id) { return res.status(401).send('Not Allow') }
        note = await Notes.findByIdAndDelete(req.params.id)
        res.json({ "SUCCESS": "Your note has been successfully Deleted!", note: note })
    }
    catch (error) {
        console.log(error)
        res.status(500).send('Internal Server Error!')
    }
})

module.exports = router