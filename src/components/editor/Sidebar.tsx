import { useRef } from "react";
import { useDrag } from "react-dnd";
import { ItemTypes } from "../../types";
import type { JSX } from "react";

// SVG icon for Heading component (a simple 'H' shape)
const HeadingIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24px"
    height="24px"
    fill="currentColor"
    viewBox="0 0 24 24" // Changed viewBox for simpler coordinates
  >
    <path d="M4 6h3v12h3V6h3V4H4v2zm10 0h6v2h-6V6zm0 4h6v2h-6v-2zm0 4h6v2h-6v-2z"></path>
  </svg>
);

// SVG icon for Paragraph component (a simple 'P' shape)
const ParagraphIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24px"
    height="24px"
    fill="currentColor"
    viewBox="0 0 24 24"
  >
    <path d="M4 4h16v2H4V4zm0 4h16v2H4V8zm0 4h10v2H4v-2zm0 4h10v2H4v-2z"></path>
  </svg>
);

// SVG icon for Button component (a simple rectangle)
const ButtonIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24px"
    height="24px"
    fill="currentColor"
    viewBox="0 0 24 24"
  >
    <rect x="4" y="8" width="16" height="8" rx="2" ry="2"></rect>
  </svg>
);

// SVG icon for Image component (a simple mountain/sun icon)
const ImageIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24px"
    height="24px"
    fill="currentColor"
    viewBox="0 0 24 24"
  >
    <path d="M19 5H5c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zM5 17l3.5-4.5 2.5 3.01L14.5 11l4.5 6H5z"></path>
  </svg>
);

// Returns the right icon based on the component type
const Icon = ({ type }: { type: string }) => {
  switch (type) {
    case ItemTypes.HEADING:
      return <HeadingIcon />;
    case ItemTypes.PARAGRAPH:
      return <ParagraphIcon />;
    case ItemTypes.BUTTON:
      return <ButtonIcon />;
    case ItemTypes.IMAGE:
      return <ImageIcon />;
    default:
      return null;
  }
};

// Reusable draggable card for each component in the sidebar
const DraggableItem = ({
  type,
  title,
  icon,
}: {
  type: string;
  title: string;
  icon: JSX.Element;
}) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: type,
    item: { type: type, title: title },
    collect: (monitor) => ({ isDragging: !!monitor.isDragging() }),
  }));

  const ref = useRef<HTMLDivElement>(null);
  drag(ref);

  return (
    <div
      ref={ref}
      className="component-card"
      style={{ opacity: isDragging ? 0.5 : 1 }}
    >
      {icon}
      <h2>{title}</h2>
    </div>
  );
};

// Sidebar container with list of draggable components
function SidebarComponent() {
  const components = [
    {
      type: ItemTypes.HEADING,
      title: "Heading",
      icon: <Icon type={ItemTypes.HEADING} />,
    },
    {
      type: ItemTypes.PARAGRAPH,
      title: "Paragraph",
      icon: <Icon type={ItemTypes.PARAGRAPH} />,
    },
    {
      type: ItemTypes.BUTTON,
      title: "Button",
      icon: <Icon type={ItemTypes.BUTTON} />,
    },
    {
      type: ItemTypes.IMAGE,
      title: "Image",
      icon: <Icon type={ItemTypes.IMAGE} />,
    },
  ];

  return (
    <aside className="editor-panel sidebar">
      <h2>Components</h2>
      <div className="component-grid">
        {components.map((comp) => (
          <DraggableItem key={comp.type} {...comp} />
        ))}
      </div>
    </aside>
  );
}

// Export Sidebar with static members if needed elsewhere
export const Sidebar = Object.assign(SidebarComponent, {
  DraggableItem,
  Icon,
});
