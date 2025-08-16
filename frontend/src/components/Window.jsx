import Draggable from "react-draggable";
import { useState } from "react";

export default function Window({ id, title, children, onClose, onDragStop, defaultPos }) {
  const [z, setZ] = useState(1);
  return (
    <Draggable
      defaultPosition={defaultPos || { x: 60, y: 60 }}
      onStart={() => setZ((n) => n + 1)}
      onStop={(_, data) => onDragStop?.(id, { x: data.x, y: data.y })}
    >
      <div style={{
        position: "absolute",
        width: 360,
        background: "white",
        border: "1px solid #ccc",
        borderRadius: 8,
        boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
        zIndex: z
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 12px", background: "#f5f5f5", borderTopLeftRadius: 8, borderTopRightRadius: 8 }}>
          <strong>{title}</strong>
          <button onClick={() => onClose?.(id)}>✕</button>
        </div>
        <div style={{ padding: 12 }}>{children}</div>
      </div>
    </Draggable>
  );
}
