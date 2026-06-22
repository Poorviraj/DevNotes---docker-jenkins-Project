import { useState, useEffect } from 'react';
import API from '../api/axios';
import NoteForm from '../components/NoteForm';
import NoteCard from '../components/NoteCard';

const Dashboard = () => {
    const [notes, setNotes] = useState([]);
    const [search, setSearch] = useState('');
    const [editingNote, setEditingNote] = useState(null);

    const fetchNotes = async () => {
        const { data } = await API.get('/notes', { params: { search } });
        setNotes(data);
    };

    useEffect(() => {
        fetchNotes();
    }, [search]);

    const handleCreateOrUpdate = async (noteData) => {
        if (editingNote) {
            await API.put(`/notes/${editingNote._id}`, noteData);
            setEditingNote(null);
        } else {
            await API.post('/notes', noteData);
        }
        fetchNotes();
    };

    const handleDelete = async (id) => {
        await API.delete(`/notes/${id}`);
        fetchNotes();
    };

    return (
        <div className="max-w-3xl mx-auto px-4 py-8">
            <input
                type="text"
                placeholder="Search notes..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full border border-slate-300 rounded-md px-3 py-2 mb-6 focus:outline-none focus:ring-2 focus:ring-slate-500"
            />

            <NoteForm
                onSubmit={handleCreateOrUpdate}
                editingNote={editingNote}
                onCancel={() => setEditingNote(null)}
            />

            <div className="grid gap-4">
                {notes.map((note) => (
                    <NoteCard
                        key={note._id}
                        note={note}
                        onEdit={setEditingNote}
                        onDelete={handleDelete}
                    />
                ))}
                {notes.length === 0 && (
                    <p className="text-center text-slate-400">No notes yet. Add one above!</p>
                )}
            </div>
        </div>
    );
};

export default Dashboard;