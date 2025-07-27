import React, { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { v4 as uuidv4 } from "uuid";

function KanbanBoard({ columns, setColumns }) {
  const [taskInputs, setTaskInputs] = useState({
    ToDo: "",
    Inprogress: "",
    Completed: "",
  });

  const handleMoveToNextColumn = (fromColumnId, toColumnId, taskId) => {
    const taskToMove = columns[fromColumnId].items.find(item => item.id === taskId);
    if (!taskToMove) return;

    const updatedFrom = columns[fromColumnId].items.filter(item => item.id !== taskId);
    const updatedTo = [...columns[toColumnId].items, taskToMove];

    setColumns({
      ...columns,
      [fromColumnId]: {
        ...columns[fromColumnId],
        items: updatedFrom,
      },
      [toColumnId]: {
        ...columns[toColumnId],
        items: updatedTo,
      },
    });
  };

  const handleDeleteTask = (columnId, taskId) => {
    const updatedItems = columns[columnId].items.filter(item => item.id !== taskId);
    setColumns({
      ...columns,
      [columnId]: {
        ...columns[columnId],
        items: updatedItems,
      },
    });
  };

  const handleToggleComplete = (columnId, taskId) => {
    const updatedItems = columns[columnId].items.map(item =>
      item.id === taskId ? { ...item, completed: !item.completed } : item
    );

    setColumns({
      ...columns,
      [columnId]: {
        ...columns[columnId],
        items: updatedItems,
      },
    });
  };

  const handleDrag = (result) => {
    const { source, destination } = result;
    if (!destination) return;

    const sourceColumn = columns[source.droppableId];
    const destColumn = columns[destination.droppableId];
    const sourceItems = [...sourceColumn.items];
    const destItems = [...destColumn.items];

    const [movedItem] = sourceItems.splice(source.index, 1);
    destItems.splice(destination.index, 0, movedItem);

    setColumns({
      ...columns,
      [source.droppableId]: {
        ...sourceColumn,
        items: sourceItems,
      },
      [destination.droppableId]: {
        ...destColumn,
        items: destItems,
      },
    });
  };

  const handleInputChange = (columnId, value) => {
    setTaskInputs((prev) => ({
      ...prev,
      [columnId]: value,
    }));
  };

  const handleAddTask = (columnId) => {
    const newTask = {
      id: uuidv4(),
      title: taskInputs[columnId].trim(),
    };

    if (!newTask.title) return;

    const updatedColumn = {
      ...columns[columnId],
      items: [...columns[columnId].items, newTask],
    };

    setColumns({
      ...columns,
      [columnId]: updatedColumn,
    });

    setTaskInputs((prev) => ({
      ...prev,
      [columnId]: "",
    }));
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4 text-primary fw-bold">📝 Kanban Task Manager</h2>

      <DragDropContext onDragEnd={handleDrag}>
        <div className="row gy-4">
          {Object.entries(columns).map(([columnId, column]) => (
            <div key={columnId} className="col-md-4">
              <div className="bg-white p-3 rounded-4 shadow border border-2 border-primary-subtle">
                <h5 className="text-center text-uppercase fw-bold text-primary mb-3">
                  {column.name}
                </h5>

                <div className="mb-3 d-flex">
                  <input
                    className="form-control form-control-sm me-2"
                    type="text"
                    placeholder="Add new task..."
                    value={taskInputs[columnId]}
                    onChange={(e) => handleInputChange(columnId, e.target.value)}
                  />
                  <button
                    className="btn btn-sm btn-primary"
                    onClick={() => handleAddTask(columnId)}
                  >
                    Add
                  </button>
                </div>

                <Droppable droppableId={columnId}>
                  {(provided, snapshot) => (
                    <div
                      className="kanban-column"
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      style={{
                        minHeight: "250px",
                        background: snapshot.isDraggingOver ? "#e7f1ff" : "#f8f9fa",
                        transition: "background-color 0.3s",
                      }}
                    >
                      {column.items.map((item, idx) => (
                        <Draggable key={item.id} draggableId={item.id} index={idx}>
                          {(provided, snapshot) => (
                            <div
                              className={`task-card`}
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              style={{
                                ...provided.draggableProps.style,
                                backgroundColor: "#fff",
                                boxShadow: snapshot.isDragging ? "0 0 .6rem rgba(0, 123, 255, 0.5)" : "none",
                                transition: "all 0.2s",
                              }}
                            >
                              <div className="card-body d-flex justify-content-between align-items-start p-2">
                                <div className="d-flex flex-column">
                                  <div className="form-check mb-1">
                                    <input
                                      type="checkbox"
                                      className="form-check-input me-2"
                                      checked={item.completed}
                                      onChange={() => handleToggleComplete(columnId, item.id)}
                                    />
                                    <label
                                      className={`form-check-label ${item.completed ? "text-decoration-line-through text-muted" : ""
                                        }`}
                                    >
                                      {item.title}
                                    </label>
                                  </div>

                                  {/* Move buttons */}
                                  {columnId === "todo" && (
                                    <button
                                      className="btn btn-sm btn-outline-info mt-1"
                                      onClick={() =>
                                        handleMoveToNextColumn("todo", "inprogress", item.id)
                                      }
                                    >
                                      ➡️ Move to In Progress
                                    </button>
                                  )}

                                  {columnId === "inprogress" && (
                                    <button
                                      className="btn btn-sm btn-outline-success mt-1"
                                      onClick={() =>
                                        handleMoveToNextColumn("inprogress", "done", item.id)
                                      }
                                    >
                                      ✅ Move to Done
                                    </button>
                                  )}
                                </div>

                                {/* Delete button */}
                                <button
                                  className="btn btn-sm btn-danger ms-2"
                                  onClick={() => handleDeleteTask(columnId, item.id)}
                                  title="Delete task"
                                >
                                  ✖
                                </button>
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            </div>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
}

export default KanbanBoard;
