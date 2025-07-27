// src/App.jsx
import React, { useState, useEffect } from "react";
import KanbanBoard from "./components/KanbanBoard";

function App() {
  const [columns, setColumns] = useState(() => {
    const saved = localStorage.getItem("kanban-columns");
    if (saved) return JSON.parse(saved);
    return {
      todo: { name: "To-Do", items: [] },
      inprogress: { name: "In Progress", items: [] },
      done: { name: "Completed", items: [] },
    };
  });

  // Whenever 'columns' changes, save to localStorage
  useEffect(() => {
    localStorage.setItem("kanban-columns", JSON.stringify(columns));
  }, [columns]);

  return <KanbanBoard columns={columns} setColumns={setColumns} />;
}

export default App;
