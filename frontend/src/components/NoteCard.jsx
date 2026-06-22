const NoteCard = ({ note, onEdit, onDelete }) => {
    return (
        <div className="bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition">
            <h3 className="font-semibold text-lg text-slate-800">{note.title}</h3>
            <p className="text-slate-600 text-sm mt-1 mb-3 whitespace-pre-wrap">
                {note.content}
            </p>
            {note.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                    {note.tags.map((tag) => (
                        <span
                            key={tag}
                            className="bg-slate-100 text-slate-600 text-xs px-2 py-1 rounded-full"
                        >
                            #{tag}
                        </span>
                    ))}
                </div>
            )}
            <div className="flex gap-3 text-sm">
                <button onClick={() => onEdit(note)} className="text-blue-600 hover:underline">
                    Edit
                </button>
                <button onClick={() => onDelete(note._id)} className="text-red-500 hover:underline">
                    Delete
                </button>
            </div>
        </div>
    );
};

export default NoteCard;