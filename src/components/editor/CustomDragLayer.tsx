import { useDragLayer } from "react-dnd";
import { Sidebar } from "./Sidebar";
import { ItemTypes } from "../../types";

// This defines the general styles for the drag layer container.
const layerStyles: React.CSSProperties = {
  position: "fixed",
  pointerEvents: "none",
  zIndex: 100,
  left: 0,
  top: 0,
  width: "100%",
  height: "100%",
};

// This function calculates the position of the dragged item based on the initial and current offset.
function getItemStyles(
  initialOffset: { x: number; y: number } | null,
  currentOffset: { x: number; y: number } | null
) {
  if (!initialOffset || !currentOffset) {
    return {
      display: "none", // If position data is missing, don't render anything.
    };
  }

  const { x, y } = currentOffset;
  const transform = `translate(${x}px, ${y}px)`;

  return {
    transform,
    WebkitTransform: transform,
  };
}

// Custom drag layer responsible for rendering a preview of the item being dragged.
export function CustomDragLayer() {
  // Using useDragLayer to access drag state and positions.
  const { item, itemType, isDragging, initialOffset, currentOffset } =
    useDragLayer((monitor) => ({
      item: monitor.getItem(),
      itemType: monitor.getItemType(),
      initialOffset: monitor.getInitialSourceClientOffset(),
      currentOffset: monitor.getSourceClientOffset(),
      isDragging: monitor.isDragging(),
    }));

  // If nothing is being dragged, render nothing.
  if (!isDragging) {
    return null;
  }

  // Decides what to render as the drag preview.
  function renderItem() {
    if (!itemType || !item) return null;

    // These are the types of components that can be dragged from the sidebar.
    const sidebarItemTypes = [
      ItemTypes.HEADING,
      ItemTypes.PARAGRAPH,
      ItemTypes.BUTTON,
      ItemTypes.IMAGE,
    ];

    // If the dragged item is from the sidebar, render a styled preview box with icon and label.
    if (sidebarItemTypes.includes(itemType as string)) {
      return (
        <div style={{ width: "240px" }}>
          <Sidebar.DraggableItem
            type={item.type}
            title={item.title || item.type}
            icon={<Sidebar.Icon type={item.type} />}
          />
        </div>
      );
    }

    // If the item is already on the canvas (being reordered), no need to render custom preview.
    if (itemType === ItemTypes.CANVAS_COMPONENT) {
      return null;
    }

    // Fallback for unknown item types.
    return null;
  }

  // Render the drag layer with computed styles and the item preview inside.
  return (
    <div style={layerStyles}>
      <div style={getItemStyles(initialOffset, currentOffset)}>
        {renderItem()}
      </div>
    </div>
  );
}
