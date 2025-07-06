import { useState, useEffect, useCallback } from "react";
import { Sidebar } from "./components/editor/Sidebar";
import { Canvas } from "./components/editor/Canvas";
import { PropertiesPanel } from "./components/editor/PropertiesPanel";
import { CustomDragLayer } from "./components/editor/CustomDragLayer";
import type { CanvasComponent } from "./types";
import { ItemTypes } from "./types";
import "./styles/layout.css";

function App() {
  // State to hold all components currently on the canvas
  const [canvasComponents, setCanvasComponents] = useState<CanvasComponent[]>(
    () => {
      try {
        // Try to restore the canvas from localStorage on initial load
        const savedComponentsJSON = localStorage.getItem(
          "mini-editor-components"
        );
        if (savedComponentsJSON) {
          const loadedComponents = JSON.parse(savedComponentsJSON);
          // Reset transient file property to null (Base64 is stored in 'content' field)
          return loadedComponents.map((comp: CanvasComponent) => ({
            ...comp,
            file: null,
          }));
        }
      } catch (error) {
        console.error("Failed to load components from localStorage", error);
      }
      return [];
    }
  );

  // State to track the currently selected component on the canvas
  const [selectedComponentId, setSelectedComponentId] = useState<number | null>(
    null
  );

  // Persist canvas components to localStorage on every change
  useEffect(() => {
    const componentsToSave = canvasComponents.map((component) => ({
      ...component,
      file: null, // Ensure we don't try to save the File object, only Base64 in content
    }));
    localStorage.setItem(
      "mini-editor-components",
      JSON.stringify(componentsToSave)
    );
  }, [canvasComponents]);

  // Factory function to create a new component with default values
  const createNewComponent = (type: string): CanvasComponent => {
    let content = "Some default text";
    let link: string | undefined = undefined; // Initialize link as undefined

    if (type === ItemTypes.HEADING) content = "New Heading";
    if (type === ItemTypes.BUTTON) {
      content = "Click me";
      link = "#"; // Default link for buttons
    }
    if (type === ItemTypes.IMAGE) content = "https://placehold.co/600x400";

    return {
      id: new Date().getTime(), // Use timestamp as a unique ID
      type: type,
      content: content,
      styles: {
        color: type === ItemTypes.BUTTON ? "#FFFFFF" : "#000000",
        fontSize: type === ItemTypes.HEADING ? "24px" : "16px",
        fontWeight: type === ItemTypes.HEADING ? "bold" : "normal",
        backgroundColor: type === ItemTypes.BUTTON ? "#3b82f6" : "transparent",
      },
      imageSourceType: "link", // Default for image, will be overridden if not image
      file: null,
      link: link, // Assign the link property
    };
  };

  // Handles a drop event by adding a new component at the end of the canvas
  const handleDrop = (type: string) => {
    const newComponent = createNewComponent(type);
    setCanvasComponents((prev) => [...prev, newComponent]);
  };

  // Inserts a component at a specific position in the canvas
  const addComponentAtIndex = (type: string, index: number) => {
    const newComponent = createNewComponent(type);
    setCanvasComponents((prev) => {
      const newComponents = [...prev];
      newComponents.splice(index, 0, newComponent);
      return newComponents;
    });
  };

  // Updates properties of a component by ID
  const updateComponent = (id: number, newProps: Partial<CanvasComponent>) => {
    setCanvasComponents((prev) =>
      prev.map((component) =>
        component.id === id
          ? {
              ...component,
              ...newProps,
              styles: { ...component.styles, ...newProps.styles },
            }
          : component
      )
    );
  };

  // Removes a component from the canvas by ID
  const removeComponent = (id: number) => {
    setCanvasComponents((prev) =>
      prev.filter((component) => component.id !== id)
    );
  };

  // Sets the currently selected component
  const handleSelectComponent = (id: number | null) => {
    setSelectedComponentId(id);
  };

  // Moves a component up or down in the list based on drag-and-drop
  const moveComponent = useCallback((dragIndex: number, hoverIndex: number) => {
    setCanvasComponents((prevComponents) => {
      const newComponents = [...prevComponents];
      const draggedComponent = newComponents[dragIndex];
      newComponents.splice(dragIndex, 1);
      newComponents.splice(hoverIndex, 0, draggedComponent);
      return newComponents;
    });
  }, []);

  // Find the component that is currently selected (if any)
  const selectedComponent = canvasComponents.find(
    (c) => c.id === selectedComponentId
  );

  // Render main layout with editor UI
  return (
    <div className="editor-container">
      <Sidebar />
      <Canvas
        components={canvasComponents}
        onDrop={handleDrop}
        removeComponent={removeComponent}
        onSelectComponent={handleSelectComponent}
        selectedComponentId={selectedComponentId}
        moveComponent={moveComponent}
        addComponentAtIndex={addComponentAtIndex}
        updateComponent={updateComponent}
      />
      <PropertiesPanel
        selectedComponent={selectedComponent}
        updateComponent={updateComponent}
      />
      <CustomDragLayer />
    </div>
  );
}

export default App;
