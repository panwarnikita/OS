import { useEffect, useState } from "react";
import api from "../api";
import Window from "../components/Window.jsx";
import NotesApp from "../components/NotesApp.jsx";

// Importing icons from react-icons library
// Humne yahan 'BsGridFill' ka istemal kiya hai jo sabhi versions mein kaam karega
import { BsChatFill, BsFillImageFill, BsFileTextFill, BsGearFill, BsGridFill } from "react-icons/bs";

// Styles Object for cleaner code
const styles = {
  desktopContainer: {
    width: "100vw",
    height: "100vh",
    backgroundImage: "url('/src/assets/background.jpg')", 
    backgroundSize: "cover",
    backgroundPosition: "center",
    position: "relative",
    overflow: "hidden",
    fontFamily: "'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
  },
  topBar: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 35,
    background: "rgba(0, 0, 0, 0.2)",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 20px",
    backdropFilter: "blur(10px)",
    color: "white",
    borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
  },
  logoutButton: {
    background: 'rgba(255, 255, 255, 0.1)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    color: 'white',
    padding: '5px 12px',
    borderRadius: '8px',
    cursor: 'pointer',
  },
  dockContainer: {
    position: "absolute",
    top: "50%",
    left: 20,
    transform: "translateY(-50%)",
    display: "flex",
    flexDirection: "column",
    gap: 100,
  },
  dockItem: {
    width: 64,
    height: 64,
    borderRadius: 16,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    color: "white",
    backdropFilter: "blur(10px)",
    border: "1px solid rgba(255, 255, 255, 0.2)",
    boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
    transition: "transform 0.2s ease-in-out",
  },
  dockIcon: {
    fontSize: 28,
  },
  dockLabel: {
    fontSize: 12,
    marginTop: 5,
    fontWeight: 500,
  },
  bottomBar: {
    position: "absolute",
    bottom: 20,
    left: "50%",
    transform: "translateX(-50%)",
    width: "40%",
    maxWidth: "500px",
    height: 48,
    background: "rgba(0, 0, 0, 0.2)",
    borderRadius: 24,
    display: "flex",
    alignItems: "center",
    padding: "0 20px",
    backdropFilter: "blur(10px)",
    border: "1px solid rgba(255, 255, 255, 0.2)",
    boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
  },
  searchInput: {
    border: "none",
    outline: "none",
    background: "transparent",
    width: "100%",
    fontSize: 16,
    color: "white",
    marginLeft: 12,
  },
};

// Custom styles for each icon to match the image
const chatIconStyle = { ...styles.dockItem, background: "linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)" };
const galleryIconStyle = { ...styles.dockItem, background: "linear-gradient(135deg, #dd2476 0%, #ff512f 100%)" };
const notesIconStyle = { ...styles.dockItem, background: "linear-gradient(135deg, #ff9a44 0%, #fc6076 100%)" };
const settingsIconStyle = { ...styles.dockItem, background: "linear-gradient(135deg, #526d82 0%, #27374d 100%)" };


export default function Desktop({ onLogout }) {
  const [windows, setWindows] = useState([]);
  const [layout, setLayout] = useState({});

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get("/state");
        const saved = data?.windows || {};
        setLayout(saved);
        const open = Object.keys(saved).map((id) => ({ id, type: id, pos: saved[id] }));
        setWindows(open);
      } catch (error) {
        console.error("Failed to load state:", error);
      }
    })();
  }, []);

  function openApp(type) {
    const id = type;
    const pos = layout[id] || { x: Math.random() * 200 + 80, y: Math.random() * 100 + 80 };
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
    try {
      await api.put("/state", { windows: newLayout });
    } catch (error) {
      console.error("Failed to save state:", error);
    }
  }

  return (
    <div style={styles.desktopContainer}>
      {/* Top Bar */}
      <div style={styles.topBar}>
        <div><strong>My OS</strong></div>
        <div>
          <button onClick={onLogout} style={styles.logoutButton}>Logout</button>
        </div>
      </div>

      {/* Windows */}
      {windows.map(w => (
        <Window
          key={w.id}
          id={w.id}
          title={w.type.charAt(0).toUpperCase() + w.type.slice(1)} // Capitalize title
          defaultPos={layout[w.id]}
          onClose={closeWindow}
          onDragStop={onDragStop}
        >
          {w.type === "notes" && <NotesApp />}
          {w.type === "chat" && <div>Chat App UI</div>}
          {w.type === "gallery" && <div>Gallery App UI</div>}
          {w.type === "settings" && <div>Settings App UI</div>}
        </Window>
      ))}

      {/* Left Sidebar Dock */}
      <div style={styles.dockContainer}>
        <div onClick={() => openApp("chat")} style={chatIconStyle} title="Chat">
          <BsChatFill style={styles.dockIcon} />
          <span style={styles.dockLabel}>Chat</span>
        </div>
        <div onClick={() => openApp("gallery")} style={galleryIconStyle} title="Gallery">
          <BsFillImageFill style={styles.dockIcon} />
          <span style={styles.dockLabel}>Gallery</span>
        </div>
        <div onClick={() => openApp("notes")} style={notesIconStyle} title="Notes">
          <BsFileTextFill style={styles.dockIcon} />
          <span style={styles.dockLabel}>Notes</span>
        </div>
        <div onClick={() => openApp("settings")} style={settingsIconStyle} title="Settings">
          <BsGearFill style={styles.dockIcon} />
          <span style={styles.dockLabel}>Settings</span>
        </div>
      </div>

      {/* Bottom Search Bar */}
      <div style={styles.bottomBar}>
        {/* Humne yahan 'BsGridFill' ka istemal kiya hai */}
        <BsGridFill style={{ color: "rgba(255, 255, 255, 0.7)", fontSize: 20 }}/>
        <input 
          type="text" 
          placeholder="Search..." 
          style={styles.searchInput} 
        />
      </div>
    </div>
  );
}





