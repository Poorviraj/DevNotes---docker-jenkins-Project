import { useState, useEffect } from 'react';

const NoteForm = ({ onSubmit, editingNote, onCancel }) => {
    const [form, setForm] = useState({ title: '', content: '', tags: '' });

    useEffect(() => {
        if (editingNote) {
            setForm({
                title: editingNote.title,
                content: editingNote.content,
                tags: editingNote.tags.join(', '),
            });
        } else {
            setForm({ title: '', content: '', tags: '' });
        }
    }, [editingNote]);

    const handleChange = (e) =>
        setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = (e) => {
        e.preventDefault();
        const tagsArray = form.tags
            .split(',')
            .map((t) => t.trim())
            .filter((t) => t.length > 0);

        onSubmit({ ...form, tags: tagsArray });
        setForm({ title: '', content: '', tags: '' });
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white p-5 rounded-xl shadow-sm mb-6">
            <input
                name="title"
                placeholder="Title"
                value={form.title}
                onChange={handleChange}
                className="w-full border border-slate-300 rounded-md px-3 py-2 mb-3 focus:outline-none focus:ring-2 focus:ring-slate-500"
                required
            />
            <textarea
                name="content"
                placeholder="Write your note..."
                value={form.content}
                onChange={handleChange}
                rows="3"
                className="w-full border border-slate-300 rounded-md px-3 py-2 mb-3 focus:outline-none focus:ring-2 focus:ring-slate-500"
                required
            />
            <input
                name="tags"
                placeholder="Tags (comma separated)"
                value={form.tags}
                onChange={handleChange}
                className="w-full border border-slate-300 rounded-md px-3 py-2 mb-3 focus:outline-none focus:ring-2 focus:ring-slate-500"
            />
            <div className="flex gap-2">
                <button
                    type="submit"
                    className="bg-slate-800 text-white px-4 py-2 rounded-md hover:bg-slate-700 transition"
                >
                    {editingNote ? 'Update Note' : 'Add Note'}
                </button>
                {editingNote && (
                    <button
                        type="button"
                        onClick={onCancel}
                        className="bg-slate-200 text-slate-700 px-4 py-2 rounded-md hover:bg-slate-300 transition"
                    >
                        Cancel
                    </button>
                )}
            </div>
        </form>
    );
};

export default NoteForm;