import { useRef } from "react";
import { useDrop } from "react-dnd";
import type { CanvasComponent } from "../../types";
import { ItemTypes } from "../../types";

interface EditableProps {
  id: number;
  content: string;
  updateComponentContent: (id: number, newContent: string) => void;
  as?: React.ElementType;
}

function Editable({
  id,
  content,
  updateComponentContent,
  as: Component = "p",
}: EditableProps) {
  const handleBlur = (evt: React.FocusEvent<HTMLElement>) => {
    updateComponentContent(id, evt.currentTarget.textContent || "");
  };

  return (
    <Component
      contentEditable
      suppressContentEditableWarning
      onBlur={handleBlur}
      style={{ padding: "4px", border: "1px dashed transparent", flexGrow: 1 }}
    >
      {content}
    </Component>
  );
}

// --- ATUALIZE A INTERFACE DE PROPS ---
interface CanvasProps {
  components: CanvasComponent[];
  onDrop: (type: string) => void;
  updateComponentContent: (id: number, newContent: string) => void;
  removeComponent: (id: number) => void; // Adicione esta linha
}

export function Canvas({
  components,
  onDrop,
  updateComponentContent,
  removeComponent,
}: CanvasProps) {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: Object.values(ItemTypes),
    drop: (item: { type: string }) => onDrop(item.type),
    collect: (monitor) => ({ isOver: !!monitor.isOver() }),
  }));

  const canvasRef = useRef<HTMLElement>(null);
  drop(canvasRef);

  const renderComponent = (component: CanvasComponent) => {
    switch (component.type) {
      case ItemTypes.PARAGRAPH:
        return (
          <Editable
            {...component}
            updateComponentContent={updateComponentContent}
            as="p"
          />
        );
      case ItemTypes.HEADING:
        return (
          <Editable
            {...component}
            updateComponentContent={updateComponentContent}
            as="h1"
          />
        );
      case ItemTypes.BUTTON:
        return (
          <button
            style={{
              padding: "10px 15px",
              border: "1px solid #ccc",
              margin: "5px 0",
              background: "white",
            }}
          >
            <Editable
              {...component}
              updateComponentContent={updateComponentContent}
              as="span"
            />
          </button>
        );
      case ItemTypes.IMAGE:
        return (
          <img
            src={component.content}
            alt="canvas element"
            style={{ maxWidth: "100%", margin: "5px 0" }}
          />
        );
      default:
        return null;
    }
  };

  return (
    <main
      ref={canvasRef}
      style={{
        flex: 1,
        padding: "1rem",
        backgroundColor: isOver ? "#f0f8ff" : "#ffffff",
        border: "2px dashed #ccc",
        margin: "1rem",
        borderRadius: "8px",
        color: "#000000",
      }}
    >
      {components.length === 0 && (
        <div style={{ textAlign: "center", color: "#aaa", marginTop: "40vh" }}>
          Drop components here
        </div>
      )}
      {/* --- ATUALIZE O MAP PARA INCLUIR O BOTÃO --- */}
      {components.map((component) => (
        <div
          key={component.id}
          className="canvas-component"
          style={{
            display: "flex",
            alignItems: "center",
            padding: "5px",
            border: "1px solid transparent",
            ":hover": { borderColor: "blue" },
          }}
        >
          <div style={{ flexGrow: 1 }}>{renderComponent(component)}</div>
          <button
            onClick={() => removeComponent(component.id)}
            style={{
              marginLeft: "10px",
              cursor: "pointer",
              border: "none",
              background: "transparent",
              color: "#ff4d4d",
              fontSize: "1.2rem",
              fontWeight: "bold",
            }}
            title="Remove component"
          >
            &times;
          </button>
        </div>
      ))}
    </main>
  );
}
