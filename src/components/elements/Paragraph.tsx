import { useRef } from "react";
import { useDrag } from "react-dnd";
import { ItemTypes } from "../../types";
import "./elements.css";

export function Paragraph() {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.PARAGRAPH,
    item: { type: ItemTypes.PARAGRAPH },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  const elementRef = useRef<HTMLDivElement>(null);
  drag(elementRef);

  return (
    <div
      ref={elementRef}
      className="element"
      style={{
        opacity: isDragging ? 0.5 : 1,
      }}
    >
      <span className="element-icon">¶</span>
      <span className="element-name">Paragraph</span>
    </div>
  );
}
