import { useRef } from "react";
import { useDrag } from "react-dnd";
import { ItemTypes } from "../../types";
import "./elements.css";

// Heading component shown in the sidebar, available to drag into the canvas
export function Heading() {
  // Set up drag logic using react-dnd
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.HEADING, // Define this item as a heading type
    item: { type: ItemTypes.HEADING }, // Payload data during drag
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(), // Track dragging state
    }),
  }));

  const elementRef = useRef<HTMLDivElement>(null);

  // Connect the ref to the drag handler
  drag(elementRef);

  return (
    <div
      ref={elementRef}
      className="element"
      style={{
        opacity: isDragging ? 0.5 : 1, // Lower opacity while dragging for feedback
      }}
    >
      <span className="element-icon">T</span>
      <span className="element-name">Heading</span>
    </div>
  );
}
