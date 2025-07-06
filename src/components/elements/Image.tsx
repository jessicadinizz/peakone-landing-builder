import { useRef } from "react";
import { useDrag } from "react-dnd";
import { ItemTypes } from "../../types";
import "./elements.css";

// Image component displayed in the sidebar, ready to be dragged into the canvas
export function Image() {
  // Set up drag behavior using react-dnd
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.IMAGE, // Define the drag type for this item
    item: { type: ItemTypes.IMAGE }, // Payload sent during drag
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(), // Track dragging state for visual feedback
    }),
  }));

  const elementRef = useRef<HTMLDivElement>(null);

  // Connect the ref to the drag behavior
  drag(elementRef);

  return (
    <div
      ref={elementRef}
      className="element"
      style={{
        opacity: isDragging ? 0.5 : 1, // Reduce opacity while dragging
      }}
    >
      <span className="element-icon">🖼️</span>
      <span className="element-name">Image</span>
    </div>
  );
}
