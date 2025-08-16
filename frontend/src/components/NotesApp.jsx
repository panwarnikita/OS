import { useEffect, useState } from "react";
import api from "../api";

export default function NotesApp() {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  async function load() {
    const { data } = await api.get("/notes");
    setNotes(data);
  }
  useEffect(() => { load(); }, []);

  async function addNote() {
    if (!title && !content) return;
    await api.post("/notes", { title, content });
    setTitle(""); setContent("");
    await load();
  }

  async function updateNote(id, fields) {
    await api.put(`/notes/${id}`, fields);
    await load();
  }

  async function removeNote(id) {
    await api.delete(`/notes/${id}`);
    await load();
  }

  return (
    <div>
      <h3>Notes</h3>
      <input placeholder="Title" value={title} onChange={(e)=>setTitle(e.target.value)} />
      <textarea placeholder="Content" value={content} onChange={(e)=>setContent(e.target.value)} />
      <button onClick={addNote}>Add</button>

      <div style={{ marginTop: 12 }}>
        {notes.map(n => (
          <div key={n._id} style={{ border: "1px solid #ddd", padding: 8, borderRadius: 6, marginBottom: 8 }}>
            <input
              value={n.title}
              onChange={(e)=>updateNote(n._id, { title: e.target.value, content: n.content })}
            />
            <textarea
              value={n.content}
              onChange={(e)=>updateNote(n._id, { title: n.title, content: e.target.value })}
            />
            <button onClick={()=>removeNote(n._id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}
