import { useEffect, useState } from "react";
import api from "../api";
import Window from "../components/Window.jsx";
import NotesApp from "../components/NotesApp.jsx";

export default function Desktop({ onLogout }) {
  const [windows, setWindows] = useState([]); // [{id,type,pos:{x,y}}]
  const [layout, setLayout] = useState({});  // id -> pos

  // load cloud layout on start
  useEffect(() => {
    (async () => {
      const { data } = await api.get("/state");
      const saved = data?.windows || {};
      setLayout(saved);
      // reopen saved windows
      const open = Object.keys(saved).map((id) => ({ id, type: id, pos: saved[id] }));
      setWindows(open);
    })();
  }, []);

  function openApp(type) {
    const id = type; // simple: 1 window per app type
    const pos = layout[id] || { x: 80, y: 80 };
    const exists = windows.find(w => w.id === id);
    if (exists) return;
    setWindows((w) => [...w, { id, type, pos }]);
  }

  function closeWindow(id) {
    setWindows((w) => w.filter(x => x.id !== id));
    const newLayout = { ...layout };
    delete newLayout[id];
    saveLayout(newLayout);
  }

  async function onDragStop(id, pos) {
    const newLayout = { ...layout, [id]: pos };
    setLayout(newLayout);
    await saveLayout(newLayout);
  }

  async function saveLayout(newLayout) {
    await api.put("/state", { windows: newLayout });
  }

  return (
    <div style={{
      width: "100vw",
      height: "100vh",
      background: "linear-gradient(135deg,#9be7ff,#e6e9ff)",
      position: "relative",
      overflow: "hidden"
    }}>
      {/* Top bar */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 48, background: "rgba(255,255,255,0.6)", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 12px", backdropFilter: "blur(6px)" }}>
        <div><strong>My OS</strong></div>
        <div>
          <button onClick={()=>openApp("notes")} style={{ marginRight: 8 }}>📝 Notes</button>
          <button onClick={onLogout}>Logout</button>
        </div>
      </div>

      {/* Windows */}
      {windows.map(w => (
        <Window
          key={w.id}
          id={w.id}
          title={w.type === "notes" ? "Notes" : w.type}
          defaultPos={layout[w.id]}
          onClose={closeWindow}
          onDragStop={onDragStop}
        >
          {w.type === "notes" && <NotesApp />}
        </Window>
      ))}
    </div>
  );
}
