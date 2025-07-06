import { useRef } from "react";
import { useDrag } from "react-dnd";
import { ItemTypes } from "../../types";
import "./elements.css";

// Button component available in the sidebar for drag-and-drop into the canvas
export function Button() {
  // Setup the drag source using react-dnd
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.BUTTON, // Define the item type
    item: { type: ItemTypes.BUTTON }, // Payload data passed during drag
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(), // Track whether the item is currently being dragged
    }),
  }));

  const elementRef = useRef<HTMLDivElement>(null);

  // Attach drag functionality to the element
  drag(elementRef);

  return (
    <div
      ref={elementRef}
      className="element"
      style={{
        opacity: isDragging ? 0.5 : 1, // Dim element while dragging
      }}
    >
      <span className="element-icon">■</span>
      <span className="element-name">Button</span>
    </div>
  );
}
