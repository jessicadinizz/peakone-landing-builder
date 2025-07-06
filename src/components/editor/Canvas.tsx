import { useRef, useState } from "react";
import { useDrag, useDrop } from "react-dnd";
import type { Identifier } from "dnd-core";
import type { CanvasComponent } from "../../types";
import { ItemTypes } from "../../types";

// This component represents a single draggable item on the canvas.
function DraggableCanvasItem({
  component,
  index,
  moveComponent,
  addComponentAtIndex,
  children,
}: {
  component: CanvasComponent;
  index: number;
  moveComponent: (dragIndex: number, hoverIndex: number) => void;
  addComponentAtIndex: (type: string, index: number) => void;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const sidebarItemTypes = [
    ItemTypes.HEADING,
    ItemTypes.PARAGRAPH,
    ItemTypes.BUTTON,
    ItemTypes.IMAGE,
  ];

  // Configures the drop behavior for this canvas item.
  const [{ handlerId, isOver }, drop] = useDrop<
    { id: number; index: number; type: string },
    { droppedOn: string },
    { handlerId: Identifier | null; isOver: boolean }
  >({
    accept: [ItemTypes.CANVAS_COMPONENT, ...sidebarItemTypes],
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
        isOver: monitor.isOver() && monitor.canDrop(),
      };
    },
    drop(item, monitor) {
      if (monitor.didDrop()) return;
      if (sidebarItemTypes.includes(item.type)) {
        addComponentAtIndex(item.type, index);
        return { droppedOn: "canvas" };
      }
      return { droppedOn: "canvas" };
    },
    hover(item, monitor) {
      if (!ref.current || item.type !== ItemTypes.CANVAS_COMPONENT) return;

      const dragIndex = item.index;
      const hoverIndex = index;
      if (dragIndex === hoverIndex) return;

      const hoverBoundingRect = ref.current.getBoundingClientRect();
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

      const clientOffset = monitor.getClientOffset();
      if (!clientOffset) return;

      const hoverClientY = clientOffset.y - hoverBoundingRect.top;

      // Only move item if the cursor has crossed the middle point
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) return;
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) return;

      moveComponent(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
  });

  // Configures drag behavior
  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.CANVAS_COMPONENT,
    item: () => ({
      id: component.id,
      index,
      type: ItemTypes.CANVAS_COMPONENT,
    }),
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  // Connects both drag and drop behavior to the same element
  drag(drop(ref));

  return (
    <div
      ref={ref}
      style={{ opacity: isDragging ? 0 : 1 }}
      data-handler-id={handlerId}
      className={isOver ? "is-over" : ""}
    >
      <div className="drop-indicator" />
      {children}
    </div>
  );
}

interface CanvasProps {
  components: CanvasComponent[];
  onDrop: (type: string) => void;
  removeComponent: (id: number) => void;
  onSelectComponent: (id: number | null) => void;
  selectedComponentId: number | null;
  moveComponent: (dragIndex: number, hoverIndex: number) => void;
  addComponentAtIndex: (type: string, index: number) => void;
  updateComponent: (id: number, newProps: Partial<CanvasComponent>) => void; // Added updateComponent prop
}

// Main canvas where all components are dropped and rendered
export function Canvas({
  components,
  onDrop,
  removeComponent,
  onSelectComponent,
  selectedComponentId,
  moveComponent,
  addComponentAtIndex,
  updateComponent, // Destructure updateComponent
}: CanvasProps) {
  // State to manage which component is currently being edited directly on the canvas
  const [editingComponentId, setEditingComponentId] = useState<number | null>(
    null
  );

  const [{ isOver: isOverCanvas }, drop] = useDrop(() => ({
    accept: [
      ItemTypes.HEADING,
      ItemTypes.PARAGRAPH,
      ItemTypes.BUTTON,
      ItemTypes.IMAGE,
    ],
    drop: (item: { type: string }, monitor) => {
      if (monitor.didDrop()) return;
      onDrop(item.type);
      return { droppedOn: "canvas" };
    },
    collect: (monitor) => ({ isOver: monitor.isOver() }),
  }));

  const canvasRef = useRef<HTMLDivElement>(null);
  drop(canvasRef);

  // Handler for updating component content during direct editing
  const handleContentChange = (id: number, newContent: string) => {
    updateComponent(id, { content: newContent });
  };

  // Handler for updating component link during direct editing
  const handleLinkChange = (id: number, newLink: string) => {
    updateComponent(id, { link: newLink });
  };

  // Helper to render the actual content based on type
  const renderComponent = (component: CanvasComponent) => {
    const style = {
      color: component.styles.color,
      fontSize: component.styles.fontSize,
      fontWeight: component.styles.fontWeight,
    };

    const isCurrentlyEditing = editingComponentId === component.id;

    // Common blur handler to exit editing mode
    const handleBlur = () => {
      setEditingComponentId(null);
    };

    // Common key down handler for input fields (e.g., Enter to exit editing for Heading/Button)
    const handleKeyDown = (
      e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
      if (e.key === "Enter" && component.type !== ItemTypes.PARAGRAPH) {
        e.preventDefault(); // Prevent new line for Heading/Button
        setEditingComponentId(null);
      }
    };

    // Render editable input/textarea if currently in editing mode for text components
    if (
      isCurrentlyEditing &&
      (component.type === ItemTypes.HEADING ||
        component.type === ItemTypes.PARAGRAPH ||
        component.type === ItemTypes.BUTTON)
    ) {
      if (component.type === ItemTypes.HEADING) {
        return (
          <input
            type="text"
            value={component.content}
            onChange={(e) => handleContentChange(component.id, e.target.value)}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            autoFocus
            className="editable-input" // Add a class for potential styling
            style={{
              ...style,
              width: "100%",
              border: "1px dashed #ccc",
              padding: "5px",
            }}
          />
        );
      } else if (component.type === ItemTypes.PARAGRAPH) {
        return (
          <textarea
            value={component.content}
            onChange={(e) => handleContentChange(component.id, e.target.value)}
            onBlur={handleBlur}
            autoFocus
            rows={3}
            className="editable-textarea" // Add a class for potential styling
            style={{
              ...style,
              width: "100%",
              border: "1px dashed #ccc",
              padding: "5px",
              resize: "vertical",
            }}
          />
        );
      } else if (component.type === ItemTypes.BUTTON) {
        return (
          <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
            <input
              type="text"
              value={component.content}
              onChange={(e) =>
                handleContentChange(component.id, e.target.value)
              }
              onBlur={handleBlur}
              onKeyDown={handleKeyDown}
              autoFocus
              className="editable-button-input" // Add a class for potential styling
              placeholder="Button Text"
              style={{
                ...style,
                backgroundColor: component.styles.backgroundColor,
                padding: "10px 15px",
                border: "1px dashed #ccc", // Dashed border to indicate editing
                borderRadius: "4px",
                width: "auto", // Adjust width for button
                display: "inline-block", // Ensure button input behaves like a button
              }}
            />
            <input
              type="text"
              value={component.link || ""} // Display current link, default to empty string
              onChange={(e) => handleLinkChange(component.id, e.target.value)}
              onBlur={handleBlur}
              onKeyDown={handleKeyDown}
              className="editable-link-input"
              placeholder="Button Link (e.g., https://example.com)"
              style={{
                padding: "5px 10px",
                border: "1px dashed #ccc",
                borderRadius: "4px",
                fontSize: "12px",
                width: "100%",
              }}
            />
          </div>
        );
      }
    }

    // Existing rendering logic for non-editing or image components
    switch (component.type) {
      case ItemTypes.HEADING:
        return <h1 style={style}>{component.content}</h1>;
      case ItemTypes.PARAGRAPH:
        return <p style={style}>{component.content}</p>;
      case ItemTypes.BUTTON:
        return (
          <a
            href={component.link || "#"} // Use <a> tag for navigation, default to # if no link
            target="_blank" // Open link in a new tab
            rel="noopener noreferrer" // Security best practice for target="_blank"
            style={{
              ...style,
              backgroundColor: component.styles.backgroundColor,
              padding: "10px 15px",
              border: "none",
              borderRadius: "4px",
              textDecoration: "none", // Remove default underline for links
              display: "inline-block", // Make the <a> behave like a button
              textAlign: "center",
              cursor: "pointer",
            }}
          >
            {component.content}
          </a>
        );
      case ItemTypes.IMAGE:
        if (component.imageSourceType === "link" && component.content) {
          return (
            <img
              src={component.content}
              alt="canvas element"
              style={{ maxWidth: "100%" }}
            />
          );
        } else if (
          component.imageSourceType === "upload" &&
          component.content.startsWith("data:image")
        ) {
          return (
            <img
              src={component.content}
              alt="uploaded"
              style={{ maxWidth: "100%" }}
            />
          );
        }
        return (
          <div className="image-placeholder">
            Please provide an image link or upload a file.
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div
      ref={canvasRef}
      className="canvas-container"
      // Clicking on the canvas background should deselect and exit editing
      onClick={() => {
        onSelectComponent(null);
        setEditingComponentId(null);
      }}
    >
      {components.length === 0 ? (
        <div
          className="canvas-placeholder"
          style={{ backgroundColor: isOverCanvas ? "#f0f8ff" : "transparent" }}
        >
          <p className="placeholder-title">Drag a component here to begin</p>
          <p className="placeholder-text">
            Start building your page by dragging components from the left
            sidebar.
          </p>
        </div>
      ) : (
        <div className="canvas-content-area">
          {components.map((component, index) => (
            <DraggableCanvasItem
              key={component.id}
              index={index}
              component={component}
              moveComponent={moveComponent}
              addComponentAtIndex={addComponentAtIndex}
            >
              <div
                className={`canvas-component-wrapper ${
                  component.id === selectedComponentId ? "selected" : ""
                }`}
                // Handle single click for selection, but prevent if currently editing
                onClick={(e) => {
                  if (editingComponentId === component.id) {
                    e.stopPropagation(); // Prevent canvas container click from deselecting/exiting edit
                  } else {
                    e.stopPropagation(); // Stop propagation to prevent canvas-container click
                    onSelectComponent(component.id);
                  }
                }}
                // Handle double click to enable direct editing for text components
                onDoubleClick={(e) => {
                  if (
                    component.type === ItemTypes.HEADING ||
                    component.type === ItemTypes.PARAGRAPH ||
                    component.type === ItemTypes.BUTTON
                  ) {
                    e.stopPropagation(); // Prevent onSelectComponent from firing immediately
                    setEditingComponentId(component.id);
                  }
                }}
              >
                <div style={{ flexGrow: 1, cursor: "move" }}>
                  {renderComponent(component)}
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeComponent(component.id);
                  }}
                  className="remove-btn"
                  title="Remove component"
                >
                  &times;
                </button>
              </div>
            </DraggableCanvasItem>
          ))}
        </div>
      )}
    </div>
  );
}
