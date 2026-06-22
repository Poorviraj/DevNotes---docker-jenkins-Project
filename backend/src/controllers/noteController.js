const Note = require('../models/Note');

// GET /api/notes?search=&tag=
exports.getNotes = async (req, res) => {
    try {
        const { search, tag } = req.query;
        const query = { user: req.user };

        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { content: { $regex: search, $options: 'i' } },
            ];
        }

        if (tag) {
            query.tags = tag;
        }

        const notes = await Note.find(query).sort({ createdAt: -1 });
        res.json(notes);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.createNote = async (req, res) => {
    try {
        const { title, content, tags } = req.body;

        const note = await Note.create({
            title,
            content,
            tags: tags || [],
            user: req.user,
        });

        res.status(201).json(note);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.updateNote = async (req, res) => {
    try {
        const note = await Note.findById(req.params.id);

        if (!note) return res.status(404).json({ message: 'Note not found' });
        if (note.user.toString() !== req.user) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        Object.assign(note, req.body);
        const updatedNote = await note.save();

        res.json(updatedNote);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.deleteNote = async (req, res) => {
    try {
        const note = await Note.findById(req.params.id);

        if (!note) return res.status(404).json({ message: 'Note not found' });
        if (note.user.toString() !== req.user) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        await note.deleteOne();
        res.json({ message: 'Note removed' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};