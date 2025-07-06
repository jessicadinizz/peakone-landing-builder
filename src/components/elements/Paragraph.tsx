import { useRef } from "react";
import { useDrag } from "react-dnd";
import { ItemTypes } from "../../types";
import "./elements.css";

// Paragraph component used in the sidebar for drag-and-drop
export function Paragraph() {
  // Set up drag behavior using react-dnd
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.PARAGRAPH, // Define the drag type
    item: { type: ItemTypes.PARAGRAPH }, // Payload sent when dragging
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(), // Track drag state to adjust opacity
    }),
  }));

  const elementRef = useRef<HTMLDivElement>(null);

  // Attach the drag handler to the element
  drag(elementRef);

  return (
    <div
      ref={elementRef}
      className="element"
      style={{
        opacity: isDragging ? 0.5 : 1, // Dim the element while dragging
      }}
    >
      <span className="element-icon">¶</span>
      <span className="element-name">Paragraph</span>
    </div>
  );
}
